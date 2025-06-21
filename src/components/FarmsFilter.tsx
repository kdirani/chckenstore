import { Form } from "react-bootstrap";
import { useFarms, useSelectedFarmContext } from "../contexts";

export default function FarmsFilter() {
  const farms = useFarms().farms;
  const [selectedFarm, setSelectedFarm] = useSelectedFarmContext();
  if (!farms || farms.length === 0) return <div></div>;
  return (
    <Form className="mt-3">
      <Form.Group>
        <Form.Select
          className="mb-3 farms-filter-select"
          onChange={(e) => {
            setSelectedFarm(e.target.value);
          }}
          value={selectedFarm || ""}
        >
          <option value="">اختر المزرعة</option>
          {(farms || []).map((farm) => (
            <option key={farm.$id} value={farm.$id}>
              {farm.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <style>
        {`
          .farms-filter-select {
            background: #c62828 !important;
            color: #fff !important;
            border: 2px solid #c62828 !important;
            border-radius: 10px !important;
            font-weight: bold;
            box-shadow: 0 2px 8px #ffcdd2;
            transition: border 0.2s, box-shadow 0.2s;
            cursor: pointer;
          }
          .farms-filter-select:focus {
            border-color: #ad2323 !important;
            box-shadow: 0 0 0 2px #ffcdd2;
            cursor: pointer;
          }
          .farms-filter-select option {
            color: #fff;
            background: #c62828;
            cursor: pointer;
            
          }
        `}
      </style>
    </Form>
  );
}
