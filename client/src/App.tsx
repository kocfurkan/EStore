import { useEffect, useState } from "react"



function App() {

    const [products, setProducts] = useState([
        { name: 'product1', price: 100.00 },
        { name: 'product2', price: 200.00 },
    ]);

    useEffect(() => {
        fetch('http://localhost:5000/api/Products')
            .then(response => response.json())
            .then(data => setProducts(data))
    }, [])
    function AddProduct() {
        setProducts([...products, { name: 'product3', price: 300.00 }])
    }
    return (
        <>
            <h1>Hello There</h1>
            <ul>{products.map((item, index) => (<li key={index}>{item.name} -{item.price}</li>))}</ul>
            <button onClick={AddProduct}>Add Product</button>
        </>
    )
}

export default App
