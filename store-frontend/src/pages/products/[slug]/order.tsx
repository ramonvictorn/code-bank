import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  ListItem,
  Typography,
  ListItemAvatar,
  ListItemText,
  TextField,
  Grid,
  Box,
} from "@material-ui/core";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext, GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { route } from "next/dist/next-server/server/router";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/Home.module.css";
import http from "../../../http";
import { Product } from "../../models";
import { Avatar } from "@material-ui/core";

interface OrderPageProps {
  product: Product;
}

const product: Product = {
  id: "1",
  name: "My product 1",
  description: "Very nice product",
  price: 80.49,
  image_url: "https://source.unsplash.com/800x600",
  slug: "product-slug",
  created_at: "some date here",
};

const OrderPage: NextPage<OrderPageProps> = () => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>LOADING...</div>
  }

  return (
    <div>
      <Head>
        <title>{product.name} - Pagamento</title>
      </Head>
      <Typography gutterBottom component="h1" variant="h3" color="textPrimary">
        Checkout
      </Typography>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={product.image_url}/>
        </ListItemAvatar>
        <ListItemText
          primary={product.name}
          secondary={`R$ ${product.price}`}
        />
      </ListItem>
      <Typography gutterBottom component="h2" variant="h6">
        Pague com seu cartão de crédito
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField  label="Nome" required fullWidth/>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Número do cartão" required fullWidth inputProps={{maxLength: 16}}/>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField  type="number" label="CVV" required fullWidth/>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6} md={6}>
                <TextField  type="number" required label="Expiração mês" fullWidth/>
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField   type="number" required label="Expiração ano" fullWidth/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box marginTop={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Pagar
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default OrderPage;


export const getServerSideProps: GetServerSideProps<OrderPageProps, {slug: string }> = async (context) => {
  const { slug } = context.params;
  try {
    const { data: product } = await http.get(`products/${slug}`);
    return {
      props: {
        product,
      },
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return { notFound: true }
    }

    throw err
  }
}