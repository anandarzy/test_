import type { GetServerSideProps } from "next";
import Head from "next/head";
import CostumerAPI from "../src/api/customers";
import ErrorMessage from "../src/components/Error/ErrorMessage";
import CardComponents from "../src/components/Card/CardComponents";
import styles from "../styles/Home.module.css";
import Navbar from "../src/components/Navbar/Navbar";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import DrawerC from "../src/components/Drawer/Drawer";
import EditDrawer from "../src/components/Drawer/EditDrawer";
import { deleteCookie } from "cookies-next";
interface data {
  success: boolean;
  message: string;
  data: Array<any>;
}

interface IProps {
  data: data;
}
const Home = ({ data }: IProps) => {
  const [items, setItems] = useState(data.data);

  const [filtered, setFiltered] = useState(items);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [id, setId] = useState(null);

  if (data.success !== true) return <ErrorMessage message={data.message} />;
  return (
    <div className={styles.container}>
      <Head>
        <title>Mitramas Test</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar items={items} setFiltered={setFiltered} filtered={filtered} />
      <div className={styles.containerButton}>
        <Button onClick={() => setVisible(!visible)} icon={<PlusOutlined />}>
          Create New Data
        </Button>
      </div>

      <main className={styles.main}>
        {filtered.map((d, i) => (
          <CardComponents
            key={i}
            data={d}
            setVisible={setEditVisible}
            setId={setId}
            id={id}
          />
        ))}
        {filtered.length <= 0 && <h1>Data Not Found</h1>}
      </main>

      <EditDrawer
        visible={editVisible}
        setVisible={setEditVisible}
        datas={items}
        id={id}
      />
      <DrawerC visible={visible} setVisible={setVisible} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { token } = req.cookies;
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  const data = await CostumerAPI.all(token);

  return {
    props: { data },
  };
};
export default Home;
