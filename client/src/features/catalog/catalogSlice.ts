import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

//If Id's name is different then Id PorductId per se = >
//const productsAdapter = createEntityAdapter<Product>({
//selectId: (product) => product.ProductId,
//});
//Adapter provides query functions like linq expressions selectByýd,selectIds, selectAll etc

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null
}
const productsAdapter = createEntityAdapter<Product>();


function getAxParams(productParams: ProductParams) {
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString())
    params.append('pageSize', productParams.pageSize.toString())
    params.append('orderBy', productParams.orderBy)

    if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm)
    if (productParams.brands.length > 0) params.append('brands', productParams.brands.toString())
    if (productParams.types.length > 0) params.append('types', productParams.types.toString())

    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state:RootState}>(
    'catalog/fetchProductsAsync', async (_, thunkAPI) => {
        const params = getAxParams(thunkAPI.getState().catalog.productParams);
        try {
            const response = await agent.Catalog.list(params)

            thunkAPI.dispatch(setMetaData(response.metaData));

            return response.items


        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data })
        }
    }
)

export const getProductAsync = createAsyncThunk<Product, number>(
    'catalog/getProductAsync', async (productId, thunkAPI) => {
      
        try {
            return agent.Catalog.details(productId)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data })
        }
    }
)

export const getFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) => {
 
        try {
            return agent.Catalog.getFilters();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data })
        }
    }
)

function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
        brands: [],
        types:[]
    }
}


export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload,pageNumber:1}
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload }
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        }
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
                state.status = 'pendingGetProduct'
            })
            builder.addCase(getProductAsync.fulfilled, (state, action) => {
                productsAdapter.upsertOne(state, action.payload);
                state.status = ' idle'
            })
            builder.addCase(getProductAsync.rejected, (state, action) => {
                state.status = 'idle'
            })

            builder.addCase(getFilters.pending, (state) => {
                state.status = 'pendingGetFilters'
            })
            builder.addCase(getFilters.fulfilled, (state, action) => {
                state.brands = action.payload.brands;
                state.types = action.payload.types;
                state.status = 'idle'
                state.filtersLoaded = true;
            })
            builder.addCase(getFilters.rejected, (state, action) => {
                state.status = 'idle'
                console.log(action.payload)
            })
        })
});

export const productsSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog)

export const { setProductParams, resetProductParams, setMetaData,setPageNumber } = catalogSlice.actions;