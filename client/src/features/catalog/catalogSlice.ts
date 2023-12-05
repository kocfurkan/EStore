import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";


const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync', async (_, thunkAPI) => {
        try {
            return await agent.Catalog.list()
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const getProductAsync = createAsyncThunk<Product,number>(
    'catalog/getProductAsync', async (productId, thunkAPI) => {
        try {
            return agent.Catalog.details(productId)
        }catch (error:any) {
            return thunkAPI.rejectWithValue({error:error.data})
        }
    }
)

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: 'idle'
    }),
    reducers: {

    },
    extraReducers:
        (builder => {
            builder.addCase(fetchProductsAsync.pending, (state) => {
                state.status = 'pendingFetchProducts';
            });
            builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
                productsAdapter.setAll(state, action.payload);
                state.status = 'idle';
                state.productsLoaded = true;
            });
            builder.addCase(fetchProductsAsync.rejected, (state) => {
                state.status = 'idle'
            })
            builder.addCase(getProductAsync.pending, (state) => {
                state.status ='pendingGetProduct'
            })
            builder.addCase(getProductAsync.fulfilled, (state, action) => {
                productsAdapter.upsertOne(state, action.payload);
                state.status = ' idle'
            })
            builder.addCase(getProductAsync.rejected, (state, action) => {
                state.status ='idle'
            })
        })
});

export const productsSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog)