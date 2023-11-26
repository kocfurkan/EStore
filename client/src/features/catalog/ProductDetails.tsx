import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableFooter, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
export default function ProductDetails() {

    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       id && agent.Catalog.details(parseInt(id))
            .then(response => setProduct(response))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <LoadingComponent message='Loading product...'></LoadingComponent>
    if (!product) return <NotFound></NotFound>

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%' }}></img>
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'> {product.name}</Typography>
                <Divider sx={{ mb: 3, mt: 1 }}></Divider>
                <Typography variant='h4' color='secondary' sx={{ ml: 1 }}>${(product.price / 100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>

                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell> {product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell> {product.description}</TableCell></TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell> {product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell> {product.brand}</TableCell></TableRow>
                            <TableRow>
                                <TableCell>Quantity</TableCell>
                                <TableCell> {product.quantityInStock}</TableCell></TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell >
                                </TableCell>
                                <TableCell align="right" >
                                    All Rights Reserved
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}