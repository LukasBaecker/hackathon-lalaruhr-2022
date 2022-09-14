import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.scss";
import { Row, Card}  from "react-bootstrap";
import Col from "react-bootstrap/Col";
import { gql, useQuery } from "@apollo/client";
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import { ApolloClient, InMemoryCache } from "@apollo/client";

// graphql api client
const client = new ApolloClient({
    uri: 'http://95.111.250.248:1337/graphql',
    cache: new InMemoryCache(),
});

// image component that can maximise the image
const ImageLightbox = ({ url, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Link legacyBehavior={false} href="#" onClick={() => setIsOpen(true)}>
        <img src={url} alt="VR screenshot" className={className} />
      </Link>

      {isOpen && <Lightbox animationDisabled mainSrc={url} onCloseRequest={() => setIsOpen(false)} />}
    </div>
  );
};

// query
const ALL_SCREENSHOTS_QUERY = gql`
query allScreenshots {
  screenshots(sort: "createdAt:DESC") {
    data {
      id
      attributes {
        url
        authorName
        createdAt
        upvoteCount
      }
    }
  }
}`

// whole page component
export default function Home() {
  const { loading, data } = useQuery(ALL_SCREENSHOTS_QUERY, {
    client: client,
    pollInterval: 3000
  });

  if (loading) {
    return <div></div>
  }
  
  return (
    <div className={styles.gallery}>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icon-192x192.png' />
        <meta name='theme-color' content='#ffed00' />
        <title>Gallery</title>
        <meta
          name='description'
          content='Controll the VR glasses for the Biennale lala.ruhr 2022'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <h1 className={styles.title}>Gallery</h1>
      <div className="mt-4">
        <Row>
          {data.screenshots.data.map((singleScreenshot, index) => (
            <Col className="col-12 col-sm-4" key={singleScreenshot.attributes.url + index}>
              <Card className="ml-4">
                <div className="position-relative">
                  <ImageLightbox
                    url={singleScreenshot.attributes.url}
                    className="responsive border-0 card-img-top" />
                </div>
                <Card.Body className="pb-3 pt-3">
                  <div className="font-weight-bold h5">
                    {singleScreenshot.attributes.authorName}
                  </div>
                  <div className="text-normal align-self-center">
                    { Intl.DateTimeFormat(navigator.language, { weekday: 'long', hour: 'numeric', minute: 'numeric' })
                      .format(new Date(singleScreenshot.attributes.createdAt))
                    }
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
