import axios from "axios";

const apiUrL =
  "https://mc3nt37jj5.execute-api.sa-east-1.amazonaws.com/default/hourth_desafio";
const get = async (req, res, next) => {
  const { initDate, finishDate } = req.body;
  console.log(initDate, finishDate);
  if (!initDate || !finishDate) {
    return res.status(404).json({
      message: "Init date and finish date is required",
    });
  }
  const newInitDate = new Date(initDate);
  const newFinishDate = new Date(finishDate);
  const result = await axios.get(apiUrL);
  const productList = result.data;
  const filtedProductList = productList.filter((prodcut) => {
    const newProductDate = new Date(prodcut.consult_date).getTime();
    return (
      newProductDate >= newInitDate.getTime() &&
      newProductDate <= newFinishDate.getTime()
    );
  });
  console.log(filtedProductList);
  const groupedProductList = filtedProductList.reduce((hash, obj) => ({
    ...hash,
    [obj["product_url"]]: (hash[obj["product_url"]] || []).concat(obj),
  }));
  const newProductList = groupedProductList.map((groupedArray) => {
    const groupedDates = groupedArray.reduce((hash, obj) => ({
      ...hash,
      [obj["consult_date"]]: (hash[obj["consult_date"]] || []).concat(obj),
    }));
    const result = groupedDates.map((value, index) => {
      const total = value.reduce(
        (accumulator, current) =>
          accumulator + Number(current["vendas_no_dia"]),
        0
      );
    });
  });
  return newProductList;
};

export default { get };
