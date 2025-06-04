import ReportsForm from "../components/ReportsForm";
import { useFarms } from "../contexts";

export default function Home() {
  const farms = useFarms();
  console.log(farms);
  return (
    <div
      style={ {
        margin: '150px auto',
        textAlign: 'center',
      }}
    >
      <h1 style={{color: 'lightblue'}}>Welcome to the Daily Report App</h1>
      <p>This application provides daily reports for poultry production.</p>
      <p>Navigate to the Daily Report section to view detailed reports.</p>
      <ReportsForm></ReportsForm>
    </div>
  );
}