import { useEffect, useState } from "react"
import { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import { Typography } from "@mui/material";

function App() {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/Products')
            .then(response => response.json())
            .then(data => setProducts(data))
    }, [])
    function AddProduct() {
        setProducts(prevState => [...prevState,
            {
                id: prevState.length +101,
                name: 'product' + (prevState.length + 1),
                price: (prevState.length * 100) + 100,
                brand: 'some brand',
                description: 'some description',
                imageUrl:'http://picsum.photos/200'
            }])
    }
    return (
        <>
            <Typography variant="h1">Hello There</Typography>
            <Catalog products={products} addProduct={AddProduct }></Catalog>
        </>
    )
}

export default App
