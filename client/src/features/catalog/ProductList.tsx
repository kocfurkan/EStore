import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import { useAppSelector } from "../../app/store/configureStore";
import { Props } from "./ProducList";


export default function ProductList({ products }: Props) {
    const { productsLoaded } = useAppSelector(state => state.catalog);
    return (

        <Grid container spacing={4}>{products.map((product) => (
            <Grid item xs={4} key={product.id}>
                {!productsLoaded ? (<ProductSekeleton></ProductSekeleton>) : }
                <ProductCard product={product}></ProductCard>
            </Grid>
        ))}
        </Grid>
    );
}
