import { useState, useEffect } from "react";
import useSWR from "swr";
export default function Home(props) {
  const [sales, setSales] = useState(props.sales);
  const { data, error } = useSWR(
    "https://dbfetching-default-rtdb.firebaseio.com/sales.json"
  );

  useEffect(() => {
    if (data) {
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          name: data[key].name,
          volume: data[key].volume,
        });
      }
      setSales(transformedSales);
    }
  }, [data]);

  if (error) {
    return <p>FAILED TO LOAD.</p>;
  }

  if (!data && !sales) {
    return <p>LOADING...</p>;
  }
  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.name} - {sale.volume}
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const response = await fetch(
    "https://dbfetching-default-rtdb.firebaseio.com/sales.json"
  );
  const data = await response.json();
  const transformedSales = [];

  for(const key in data) {
    transformedSales.push({
      id : key,
      name : data[key].name,
      volume : data[key].volume,
    })
  }

  return {
    props : {
      sales : transformedSales
    }
  }
}
