import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { farmsService } from "../lib/appwrite"; // عدل المسار حسب مكان تعريف farmsService

export interface IFarm {
  name: string;
  initialChecken: number;
}

export default function FarmsForm() {
  const [name, setName] = useState("");
  const [initialChecken, setInitialChecken] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const farmData: IFarm = {
      name,
      initialChecken: Number(initialChecken),
    };

    farmsService.create(
      farmData,
      (newId) => {
        // عند نجاح الإنشاء، نعيد تعيين الحقول
        setName("");
        setInitialChecken("");
        setIsSubmitting(false);
        alert("تم حفظ المزرعة بنجاح. المعرف: " + newId);
      },
      () => {
        setIsSubmitting(false);
        alert("حدث خطأ أثناء حفظ المزرعة. حاول مرة أخرى.");
      }
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* اسم المزرعة */}
      <Form.Group controlId="farmName" className="mb-3">
        <Form.Label>اسم المزرعة</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="أدخل اسم المزرعة"
          required
          disabled={isSubmitting}
        />
      </Form.Group>

      {/* عدد الدجاج الابتدائي */}
      <Form.Group controlId="initialChecken" className="mb-3">
        <Form.Label>عدد الدجاج الابتدائي</Form.Label>
        <Form.Control
          type="number"
          value={initialChecken}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInitialChecken(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="أدخل عدد الدجاج"
          required
          disabled={isSubmitting}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "جاري الحفظ..." : "حفظ المزرعة"}
      </Button>
    </Form>
  );
}
