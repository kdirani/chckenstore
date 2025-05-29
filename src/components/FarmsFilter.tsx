import { Form } from "react-bootstrap";
import { mockDailyReports } from "../mockData";
import { useSelectedFarmContext } from "../contexts";

export default function FarmsFilter() {
  const setSelectedFarm = useSelectedFarmContext()[1];

  // Convert Set to Array before mapping
  const farmsNames = Array.from(new Set(mockDailyReports.map(report => report.farm)));

  return (
    <Form className="mt-3">
      <Form.Group>
        <Form.Select
          className="mb-3"
          onChange={(e) => {
            setSelectedFarm(e.target.value);
          }}
        >
          <option value="">اختر المزرعة</option>
          {farmsNames.map((farmName, index) => (
            <option key={index} value={farmName}>
              {farmName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Form>
  );
}
