import { ReactComponent as TimescaleLogo } from "../assets/logo.svg";
import recipientsData from "../assets/recipientsData.json";
import MainComponent from "../components/main-component/MainComponent";

const App = () => {
  return (
    <>
      <TimescaleLogo />
      <MainComponent recipientData={recipientsData} />
    </>
  );
};
export default App;
