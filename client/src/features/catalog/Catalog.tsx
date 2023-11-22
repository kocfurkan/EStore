import { Product } from "../../app/models/product";
import ProductList from "./ProducList";
import { useEffect, useState } from "react";



export default function Catalog() {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/Products')
            .then(response => response.json())
            .then(data => setProducts(data))
    }, [])

    return (
        <>
            <ProductList products={products}></ProductList>
        </>
    )
}