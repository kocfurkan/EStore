import ProductList from "./ProducList";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setPageNumber, setProductParams } from "./catalogSlice";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";
import AppPagination from "../../app/components/AppPagination";
import useProducts from "../../app/hooks/useProducts";

const sortOptions = [
  {
    value: "name",
    label: "Alphabetical",
  },
  {
    value: "priceDesc",
    label: "Price - High to low",
  },
  {
    value: "price",
    label: "Price - Low to High",
  },
];

export default function Catalog() {
  const { products, brands, types, filtersLoaded, metaData } = useProducts();

  const dispatch = useAppDispatch();
  const { productParams } = useAppSelector((state) => state.catalog);

  //By the help of entity adeptor and redux we dont have to load products everytime we refresh the page.

  if (!filtersLoaded)
    return <LoadingComponent message="Loading Products..."></LoadingComponent>;

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch></ProductSearch>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            sortOptions={sortOptions}
            selectedValue={productParams.orderBy}
            onChange={(e) =>
              dispatch(setProductParams({ orderBy: e.target.value }))
            }
          ></RadioButtonGroup>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBoxButtons
            items={brands}
            checked={productParams.brands}
            onChange={(items: string[]) =>
              dispatch(setProductParams({ brands: items }))
            }
          ></CheckBoxButtons>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBoxButtons
            items={types}
            checked={productParams.types}
            onChange={(items: string[]) =>
              dispatch(setProductParams({ types: items }))
            }
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products}></ProductList>
      </Grid>
      <Grid item xs={3}></Grid>
      {metaData && (
        <Grid item xs={9} sx={{ mb: 2 }}>
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) =>
              dispatch(setPageNumber({ pageNumber: page }))
            }
          ></AppPagination>
        </Grid>
      )}
    </Grid>
  );
}
