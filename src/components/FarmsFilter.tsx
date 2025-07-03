import { Form } from "react-bootstrap";
import { Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useFarms, useSelectedFarmContext } from "../contexts";

export default function FarmsFilter() {
  const farms = useFarms().farms;
  const [selectedFarm, setSelectedFarm] = useSelectedFarmContext();
  if (!farms || farms.length === 0) return <div></div>;
  return (
    <Form className="mt-3">
      <Form.Group>
        <Box sx={{ position: "relative", width: "100%" }}>
          <Form.Select
            className="mb-3 farms-filter-select"
            onChange={(e) => setSelectedFarm(e.target.value)}
            value={selectedFarm || ""}
            style={{
              paddingRight: "2.5em", // مساحة للسهم
            }}
          >
            <option value="">اختر المزرعة</option>
            {(farms || []).map((farm) => (
              <option key={farm.$id} value={farm.$id}>
                {farm.name}
              </option>
            ))}
          </Form.Select>
          <ArrowDropDownIcon
            sx={{
              position: "absolute",
              right: "0.2em",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#444444",
              fontSize: 32,
            }}
          />
        </Box>
      </Form.Group>
      <style>
        {`
          .farms-filter-select {
            background: #fff !important; 
            color: rgb(104, 92, 83) !important;
            border: 1px solid #ccc !important;
            border-radius: 5px !important;
            // font-weight: bold;
            font-size: 1rem;
            padding: 0.75em 2.5em 0.75em 1.2em !important;
            // box-shadow: 0 4px 16px #ffcdd2a0;
            transition: box-shadow 0.2s, border 0.2s;
            cursor: pointer;
          }
          .farms-filter-select:focus {
            box-shadow: 0 0 0 3px #444444;
            border: none !important;
          }
          .farms-filter-select option {
            color: #444444;
            background: #fff;
            font-size: 1rem;
            font-weight: 500;
            padding: 10px;
          }
        `}
      </style>
    </Form>
  );
}
