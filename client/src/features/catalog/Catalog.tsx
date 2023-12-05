import ProductList from "./ProducList";
import { useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productsSelectors } from "./catalogSlice";



export default function Catalog() {

    const products = useAppSelector(productsSelectors.selectAll)
    const dispatch = useAppDispatch();
    const { productsLoaded, status } = useAppSelector(state => state.catalog)
    useEffect(() => {
        if(!productsLoaded) dispatch(fetchProductsAsync())
    }, [productsLoaded, dispatch])

    if (status.includes('pending')) return <LoadingComponent message='Loading Products...'></LoadingComponent>

    return (
        <>
            <ProductList products={products}></ProductList>
        </>
    )
}