const generateRandomId = () => {
  const randomNumber = Math.floor(Math.random() * 100 + Math.random() * 200);

  return randomNumber;
};

export default generateRandomId;
