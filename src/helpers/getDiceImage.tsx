export const getDiceImage = (value: number) => {
  switch (value) {
    case 1:
      return <img src="/images/d6-1.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
    case 2:
      return <img src="/images/d6-2.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
    case 3:
      return <img src="/images/d6-3.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
    case 4:
      return <img src="/images/d6-4.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
    case 5:
      return <img src="/images/d6-5.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
    case 6:
      return <img src="/images/d6-6.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
  }
};
