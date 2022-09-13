import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import axios from "axios";
import useLongPress from "../useLongPress";

export default function Home() {
  const setNewUser = async () => {
    console.log("game has beeing reseted");
  };
  const doNothing = () => {
    console.log("nothing done");
  };
  const tryAPI = async () => {
    const res = await axios.put(
      "http://192.168.137.1:30010/remote/object/call",
      {
        objectPath:
          "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
        functionName: "fuck2",
        parameters: { Itensity: 3000.0 },
        generateTransaction: true,
      }
    );
    console.log(res);
  };
  const tryAPIONOFF = async () => {
    const res = await axios.put(
      "http://192.168.137.1:30010/remote/object/call",
      {
        objectPath:
          "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
        functionName: "fuck",
        generateTransaction: true,
      }
    );

    console.log(res);
  };
  const tryAnotherRound = async () => {
    const res = await axios.put(
      "http://192.168.137.1:30010/remote/object/call",
      {
        objectPath:
          "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
        functionName: "fuck3",
        parameters: { color: 1 },
        generateTransaction: true,
      }
    );
    console.log(res);
  };

  //parameters for the longpress event hook
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 2500,
  };
  const longPressEvent = useLongPress(setNewUser, doNothing, defaultOptions);

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
        <h1 className={styles.title}>Verändere die Ansicht!</h1>
        <div className={styles.grid}>
          <a onClick={tryAPI} className={styles.card}>
            <h2>Wald</h2>
            <p>Der Wald ist ein schönes Gebiet.</p>
          </a>

          <a onClick={tryAPIONOFF} className={styles.card}>
            <h2>Urbaner Garten</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a onClick={tryAnotherRound} className={styles.card}>
            <h2>Wildblumenwiese</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>
        </div>
        <span className={styles.biennale}>
          <Image
            src='/2022-04-19_lala-Biennale_Logo_gelb-uai-516x175.png'
            alt='Biennale Logo'
            width={258}
            height={88}
          />
        </span>
        <span>
          <a {...longPressEvent} className={styles.resumeCard}>
            <Image
              src='/icons8-restart.svg'
              alt='Reload Button'
              width={50}
              height={50}
            />
          </a>
        </span>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
