import { Avatar, ListItem, ListItemAvatar } from "@mui/material";
import { Product } from "../../app/models/product";

interface Props {
    product: Product
}
export default function ProductCard({product}:Props) {
    return (
        <ListItem key={product.id}>
            <ListItemAvatar>
                <Avatar src={product.imageUrl}></Avatar>
            </ListItemAvatar>
            <ListItem>
                {product.name} - {product.price}
            </ListItem>
        </ListItem>
    )
}