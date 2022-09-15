import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.scss";
import { Container, Row, Card, Modal, ButtonGroup, ToggleButton } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import { gql, useQuery, useMutation } from "@apollo/client";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import HeartIcon from 'mdi-react/HeartIcon';
import HeartOutlineIcon from 'mdi-react/HeartOutlineIcon';

// graphql api client
const client = new ApolloClient({
  uri: "https://gruenaufkumpelin.de/graphql",
  cache: new InMemoryCache(),
});

// query for all screenshots
const ALL_MESSAGES_QUERY = gql`
  query allMessages {
    messages(sort: "createdAt:DESC") {
      data {
        id
        attributes {
          messageText
        }
      }
    }
  }
`;



// single screenshot card component
const SingleMessageCard = ({
  messageText,
  index
}) => {
  return (
    <div key={index}>
      <h2>{messageText}</h2>
    </div>
  );
};

// whole page component
export default function Home() {

  const { loading, data } = useQuery(ALL_MESSAGES_QUERY, {
    client: client,
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <></>
  }

  return (
    <div className={styles.gallery}>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icon-192x192.png' />
        <meta name='theme-color' content='#ffed00' />
        <title>Galerie</title>
        <meta
          name='description'
          content='GMessagesalerie: the Biennale lala.ruhr 2022'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <h1 className="mt-4 text-center">Messages</h1>
      <div className="text-center">


        
          <Container>

            {data.messages.data.map((singleMessage, index) => (
              <SingleMessageCard
                messageText={singleMessage.attributes.messageText}
                index={index} />
            ))}

          </Container>
        

      </div>
    </div>
  );
}
