import { Form } from "react-bootstrap";
import { useFarms, useSelectedFarmContext } from "../contexts";

export default function FarmsFilter() {
  const farms = useFarms().farms;
  const setSelectedFarm = useSelectedFarmContext()[1];
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
          {(farms || []).map((farm) => (
            <option key={farm.$id} value={farm.$id}>
              {farm.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Form>
  );
}
