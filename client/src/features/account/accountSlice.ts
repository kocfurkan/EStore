import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { User } from "../../app/models/user";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setCart } from "../cart/cartSlice";

interface AccountState {
  user: User | null;
}

const initialState: AccountState = {
  user: null,
};

export const logInUser = createAsyncThunk<User, FieldValues>(
  "account/logInUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.login(data);
      //Cart will be splitted to a seperate property
      const { cart, ...user } = userDto;

      if (cart) {
        thunkAPI.dispatch(setCart(cart));
      }

      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error: Any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const getCurrentUser = createAsyncThunk<User>(
  "account/getCurrentUser",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    try {
      const userDto = await agent.Account.currentUser();
      const { cart, ...user } = userDto;

      if (cart) {
        thunkAPI.dispatch(setCart(cart));
      }

      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error: Any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  },
  {
    //Condition decides if the asyncThunk method will run or not. If it returns false it wont run at all
    condition: () => {
      if (!localStorage.getItem("user")) {
        return false;
      }
    },
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.error("Session expired, please log in again.");
      router.navigate("/");
    });
    builder.addMatcher(
      isAnyOf(logInUser.fulfilled, getCurrentUser.fulfilled),
      (state, action) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(logInUser.rejected), (state, action) => {
      console.log(action.payload);
    });
  },
});

export const { logOut, setUser } = accountSlice.actions;
