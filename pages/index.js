import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import axios from "axios";
import useLongPress from "../useLongPress";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import CircularSlider from "@fseehawer/react-circular-slider";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import Slider from "rc-slider";
import { gql, useQuery, useMutation, ApolloClient, InMemoryCache } from "@apollo/client";


// graphql api client
const client = new ApolloClient({
  uri: "https://gruenaufkumpelin.de/graphql",
  cache: new InMemoryCache(),
});

// mutation to send a message
const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($message: String) {
    createMessage(data:{
      messageText: $message
    }){
      data {
        id
      }
    }
  }
`;

export default function Home() {
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
    client: client
  });
  const [isNight, setIsNight] = useState(false); //true means night
  const [showWantToReset, setShowWantToReset] = useState(false); //state for showing the modal for resetting the dashboard or not
  const [sliderWeather, setSliderWeather] = useState(0);
  const [currentWeather, setCurrentWeather] = useState(0);
  const [currentUser, setCurrentUser] = useState("");
  const [changeTimeout, setChangeTimeout] = useState(0);
  const [activeSzenario, setActiveSzenario] = useState(0);
  const timeoutValue = 5; //this variable can be changed to set the value in seconds, how long a timeout till the next possible action should be

  //marks for weather slider
  const marks = {
    5: "Sonne",
    4: "Nebel",
    3: "Regen",
    2: "Gewitter",
    1: "Sandsturm",
  };

  const baseURL = "http://192.168.104.132:30010/remote/object/call";
  const usernamePath =
    "/Game/Biennale_Map.Biennale_Map:PersistentLevel.action_C_2";
  const functionPath =
    "/Game/Biennale_Map.Biennale_Map:PersistentLevel.action_C_2";

  useEffect(() => {
    changeTimeout > 0 &&
      setTimeout(() => setChangeTimeout(changeTimeout - 1), 1000);
  }, [changeTimeout]);

  const createTimeout = () => {
    if (changeTimeout == 0) {
      setChangeTimeout(timeoutValue);
    }
  };

  //sending daytime to the VR
  const sendWeather = async () => {
    createTimeout();
    const msg = "press " + (index + 4) + " (Weather changed)";
    sendMessage({ variables: { message: msg } });
    /*
    const res = await axios.put(baseURL, {
      objectPath: functionPath,
      functionName: "daytime",
      parameters: { daytime: isNight },
      generateTransaction: true,
    });
    console.log(res);*/
  };
  //checking if the weather has changed by the interaction of the user on slider
  const weatherChecker = () => {
    if (sliderWeather !== currentWeather) {
      setCurrentWeather(sliderWeather);
      sendWeather(sliderWeather);
    }
  };

  //sending boolean daytime to the VR
  const sendDayNight = async () => {
    createTimeout();
    if (!isNight) {
      sendMessage({ variables: { message: "press E (its Night now)" } });
    } else {
      sendMessage({ variables: { message: "press Q (its Day now)" } });
    }

    /*
    const res = await axios.put(baseURL, {
      objectPath: functionPath,
      functionName: "daytime",
      parameters: { daytime: isNight },
      generateTransaction: true,
    });
    console.log(res);
    */
  };

  //sending the level to the VR
  const sendLevel = async (index) => {
    setActiveSzenario(index);
    createTimeout();
    const msg = "press " + (index + 1) + " (Szenario changed)";
    sendMessage({ variables: { message: msg } });
    /*
    const indexArr = [1, 2, 3];
    const sendArr = indexArr.filter(function (val) {
      return val != index;
    });
    const res = await axios.put(baseURL, {
      objectPath: "/Game/Biennale_Map.Biennale_Map:PersistentLevel.action_C_0",
      functionName: "level",
      parameters: { level: index, levels: sendArr },
      generateTransaction: true,
    });
    console.log(res);
    console.log(isNight);*/
  };

  //function to reset the dashboard for a new user. The window for tipping in a name will appear
  const setNewUser = async () => {
    sendMessage({ variables: { message: "press SPACE (reset the game)" } });
    setShowWantToReset(true);
  };

  //when pushing the reset button just short, nothing would happen
  const doNothing = () => {
    console.log("Karpador setzt Platscher ein.");
  };
  /*
  //a function to change a value in the VR
  const tryAPI = async () => {
    setChangeTimeout(timeoutValue);
    const res = await axios.put(baseURL, {
      objectPath:
        "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
      functionName: "fuck2",
      parameters: { Itensity: 3000.0 },
      generateTransaction: true,
    });
    console.log(res);
  };
  const tryAPIONOFF = async () => {
    setChangeTimeout(timeoutValue);
    const res = await axios.put(baseURL, {
      objectPath:
        "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
      functionName: "fuck",
      generateTransaction: true,
    });

    console.log(res);
  };
  const tryAnotherRound = async () => {
    setChangeTimeout(timeoutValue);
    const res = await axios.put(baseURL, {
      objectPath:
        "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
      functionName: "fuck3",
      parameters: { color: 2 },
      generateTransaction: true,
    });
    console.log(res);
  };
*/
  //parameters for the longpress event hook
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 2500,
  };
  const longPressEvent = useLongPress(setNewUser, setNewUser, defaultOptions);

  return (
    <div className={styles.container}>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icon-192x192.png' />
        <meta name='theme-color' content='#ffed00' />
        <title>VR Controller</title>
        <meta
          name='description'
          content='Controll the VR glasses for the Biennale lala.ruhr 2022'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        {currentUser === "" ? (
          <>
            <h1 className={styles.title}>Wer hat gerade die VR-Brille auf?</h1>
            <Container className={styles.dashboard}>
              <Row>
                <Col className={styles.nameForm}>
                  <Formik
                    initialValues={{ name: "" }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      setSubmitting(true);
                      if (values.name === "") {
                        setSubmitting(false);
                      } else {
                        console.log(values.name);
                        setCurrentUser(values.name);
                        sendMessage({
                          variables: {
                            message: `Current user is called ${values.name}`
                          },
                        })
                        /*
                        axios
                          .put(baseURL, {
                            objectPath: usernamePath,
                            functionName: "username",
                            parameters: { username: values.name },
                            generateTransaction: true,
                          })
                          .then((res) => {
                            console.log(res);
                          });
                          */
                      }
                    }}>
                    {/* Callback function containing Formik state and helpers that handle common form actions */}
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                    }) => (
                      <Form onSubmit={handleSubmit} className='mx-auto'>
                        <Form.Group className='form-group' controlId='formName'>
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type='text'
                            name='name'
                            placeholder=''
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            className={
                              touched.name && errors.name ? "errorForm" : null
                            }
                          />
                          {touched.name && errors.name ? (
                            <div className='errorForm-message'>
                              {errors.name}
                            </div>
                          ) : null}
                        </Form.Group>
                        <Button
                          className='form-group'
                          variant='danger'
                          type='submit'
                          disabled={isSubmitting}>
                          Starten
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            </Container>
          </>
        ) : (
          <>
            <h1 className={styles.title}>
              {"Zeige " + currentUser + " die Zukunft!"}
            </h1>
            <Container className={styles.dashboard}>
              <Row>
                <Col className='szenarioButtons'>
                  <Button
                    onClick={() => {
                      sendLevel(0);
                    }}
                    variant={activeSzenario == 0 ? "warning" : "danger"}
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    Realität
                  </Button>
                  <Button
                    onClick={() => {
                      sendLevel(1);
                    }}
                    variant={activeSzenario == 1 ? "warning" : "danger"}
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    Walnussbaum
                  </Button>
                  <br />
                  <Button
                    onClick={() => {
                      sendLevel(2);
                    }}
                    variant={activeSzenario == 2 ? "warning" : "danger"}
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    Blumenwiese
                  </Button>
                  <br />
                  <Button
                    onClick={() => {
                      sendLevel(3);
                    }}
                    variant={activeSzenario == 3 ? "warning" : "danger"}
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    Wald
                  </Button>
                </Col>
                <Col className={styles.dayTimeCol}>
                  <Button
                    id={styles.dayTimeButton}
                    disabled={changeTimeout > 0 ? true : false}
                    variant='danger'
                    onClick={() => {
                      setIsNight(!isNight);
                      sendDayNight();
                    }}>
                    {" "}
                    <DarkModeSwitch
                      style={{ marginBottom: "2rem" }}
                      checked={isNight}
                      className={
                        isNight ? styles.dayTime : styles.dayTimeAllWhite
                      }
                      size={120}
                      onChange={doNothing}
                    />
                  </Button>
                </Col>
                <Col className={styles.weatherCol}>
                  {/*
                  <Button
                    variant='danger'
                    disabled={changeTimeout > 0 ? true : false}
                    className={styles.dayTimeCircle}
                    onTouchEnd={dayTimeChecker}>
                    <CircularSlider
                      min={0}
                      max={23}
                      label='Tageszeit'
                      labelColor='#00000'
                      knobColor='#ad3700'
                      progressColorFrom='#b8ddde'
                      progressColorTo='#5b3374'
                      progressSize={15}
                      trackColor='#eeeeee'
                      trackSize={10}
                      onChange={(value) => {
                        setSliderDayTime(value);
                      }}
                    />
                    </Button>{" "}*/}

                  <Button
                    variant='danger'
                    className={styles.weatherSlider}
                    disabled={changeTimeout > 0 ? true : false}
                    onTouchEnd={weatherChecker}>
                    <Slider
                      vertical
                      min={1}
                      max={5}
                      marks={marks}
                      step={1}
                      included={false}
                      defaultValue={0}
                      onChange={(value) => {
                        setSliderWeather(value);
                      }}
                    />
                  </Button>
                  {/*
                  <DropdownButton
                    variant='danger'
                    id={styles.weatherButton}
                    title='Dropdown button'>
                    <Dropdown.Item href='#/action-1'>Action</Dropdown.Item>
                    <Dropdown.Item href='#/action-2'>
                      Another action
                    </Dropdown.Item>
                    <Dropdown.Item href='#/action-3'>
                      Something else
                    </Dropdown.Item>
                  </DropdownButton>*/}
                </Col>
              </Row>
            </Container>
            <span className={styles.reloadButton}>
              <a {...longPressEvent} className={styles.resumeCard}>
                <Image
                  src='/icons8-restart.svg'
                  alt='Reload Button'
                  width={50}
                  height={50}
                />
              </a>
            </span>
            {changeTimeout !== 0 ? (
              <div className={styles.countdown}>{changeTimeout}</div>
            ) : (
              <></>
            )}

            {/**Modal opens when you click the reload button on the upper left corner */}
            <Modal
              show={showWantToReset}
              onHide={() => {
                setShowWantToReset(false);
              }}
              backdrop='static'
              keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Möchtest du das Dashboard zurücksetzten?
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Button
                  variant='danger'
                  onClick={() => {
                    setShowWantToReset(false);
                  }}>
                  Weitermachen!
                </Button>
                <Button
                  variant='warning'
                  onClick={() => {
                    setCurrentUser("");
                    setShowWantToReset(false);
                    setChangeTimeout(0);
                    setIsNight(false);
                  }}>
                  Beenden
                </Button>
              </Modal.Body>
            </Modal>
          </>
        )}
        <span className={styles.biennale}>
          <Image
            src='/gruenaufkumpelinLOGO.png'
            alt='Biennale Logo'
            width={120}
            height={120}
          />
        </span>
      </main>
    </div>
  );
}
