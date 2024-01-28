import { useEffect } from "react";
import {
  productsSelectors,
  fetchProductsAsync,
  getFilters,
} from "../../features/catalog/catalogSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

export default function useProducts() {
  const products = useAppSelector(productsSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { productsLoaded, filtersLoaded, brands, types, metaData } =
    useAppSelector((state) => state.catalog);

  //By the help of entity adeptor and redux we dont have to load products everytime we refresh the page.

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(getFilters());
  }, [dispatch, filtersLoaded]);

  return {
    products,
    productsLoaded,
    filtersLoaded,
    brands,
    types,
    metaData,
  };
}
