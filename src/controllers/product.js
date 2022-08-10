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
  const groupedProductListByProductUrl = filtedProductList.reduce(
    (previousValue, currentValue) => {
      previousValue[currentValue.product_url] =
        previousValue[currentValue.product_url] || [];
      previousValue[currentValue.product_url].push(currentValue);
      return previousValue;
    },
    Object.create(null)
  );
  const newProductList = Object.keys(groupedProductListByProductUrl).map(
    (key) => {
      const groupedArray = groupedProductListByProductUrl[key];
      const groupedDates = groupedArray.reduce(
        (previousValue, currentValue) => {
          previousValue[currentValue.consult_date] =
            previousValue[currentValue.consult_date] || [];
          previousValue[currentValue.consult_date].push(currentValue);
          return previousValue;
        },
        Object.create(null)
      );
      const totalSummedByDate = Object.keys(groupedDates).map((key) => {
        const totalByDateoBJ = {};
        const groupedByDate = groupedDates[key];
        const totalPerDate = groupedByDate.reduce(
          (previousValue, { vendas_no_dia }) => previousValue + vendas_no_dia,
          0
        );
        totalByDateoBJ[key] = totalPerDate;
        return totalByDateoBJ;
      });
      const total = totalSummedByDate.reduce((previousValue, currentValue) => {
        const firstKey = Object.keys(currentValue)[0];
        const value = currentValue[firstKey];
        return previousValue + value;
      }, 0);
      const productToReturn = Object.assign(
        { total },
        groupedArray[0],

        ...totalSummedByDate
      );
      delete productToReturn.vendas_no_dia;
      return productToReturn;
    }
  );
  return newProductList;
};

export default { get };
