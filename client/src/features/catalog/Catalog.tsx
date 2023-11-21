import { Button } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductList from "./ProducList";

interface Props {
    products: Product[],
    addProduct: () => void
}

export default function Catalog({ products, addProduct }: Props) {
    return (
        <>
            <ProductList products={products}></ProductList>
            <Button variant="contained" onClick={addProduct}>Add Product</Button>
        </>
    )
}