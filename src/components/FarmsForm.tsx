import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Form, Button, Table, Modal, Container, Row, Col } from "react-bootstrap";
import { farmsService } from "../lib/appwrite";
import { useFarms } from "../contexts";
import type { IRecursiveFarm } from "../models";

export interface IFarm {
  name: string;
  initialChecken: number;
}

export default function FarmsForm() {
  // حالة المزارع
  const { farms, loading } = useFarms();
  
  // حالة النموذج
  const [name, setName] = useState("");
  const [initialChecken, setInitialChecken] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // حالة التعديل
  const [editMode, setEditMode] = useState(false);
  const [currentFarmId, setCurrentFarmId] = useState<string | null>(null);
  
  // حالة الحذف
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState<IRecursiveFarm | null>(null);

  // إعادة تعيين النموذج
  const resetForm = () => {
    setName("");
    setInitialChecken("");
    setCurrentFarmId(null);
    setEditMode(false);
  };

  // تحميل بيانات المزرعة للتعديل
  const loadFarmForEdit = (farm: IRecursiveFarm) => {
    setName(farm.name);
    setInitialChecken(farm.initialChecken);
    setCurrentFarmId(farm.$id);
    setEditMode(true);
  };

  // معالجة تقديم النموذج (إضافة أو تعديل)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // استخدام IFarm مع استخراج البيانات المطلوبة فقط
    const farmData: IFarm = {
      name,
      initialChecken: Number(initialChecken),
    };

    if (editMode && currentFarmId) {
      // تحديث مزرعة موجودة
      farmsService.update(
        currentFarmId,
        farmData,
        () => {
          resetForm();
          setIsSubmitting(false);
          alert("تم تحديث المزرعة بنجاح");
        },
        () => {
          setIsSubmitting(false);
          alert("حدث خطأ أثناء تحديث المزرعة. حاول مرة أخرى.");
        }
      );
    } else {
      // إنشاء مزرعة جديدة
      farmsService.create(
        farmData,
        (newId) => {
          resetForm();
          setIsSubmitting(false);
          alert("تم حفظ المزرعة بنجاح. المعرف: " + newId);
        },
        () => {
          setIsSubmitting(false);
          alert("حدث خطأ أثناء حفظ المزرعة. حاول مرة أخرى.");
        }
      );
    }
  };

  // حذف مزرعة
  const confirmDelete = () => {
    if (farmToDelete) {
      farmsService.delete(farmToDelete.$id, () => {
        setShowDeleteModal(false);
        setFarmToDelete(null);
        alert("تم حذف المزرعة بنجاح");
      });
    }
  };

  // إلغاء التعديل
  const cancelEdit = () => {
    resetForm();
  };

  return (
    <Container>
      <h2 className="mb-4">{editMode ? "تعديل المزرعة" : "إضافة مزرعة جديدة"}</h2>
      
      {/* نموذج إضافة/تعديل المزرعة */}
      <Form onSubmit={handleSubmit} className="mb-5">
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

        <Row>
          <Col>
            <Button variant="primary" type="submit" disabled={isSubmitting} className="me-2">
              {isSubmitting ? "جاري الحفظ..." : editMode ? "تحديث المزرعة" : "حفظ المزرعة"}
            </Button>
            
            {editMode && (
              <Button variant="secondary" onClick={cancelEdit} disabled={isSubmitting}>
                إلغاء التعديل
              </Button>
            )}
          </Col>
        </Row>
      </Form>

      {/* جدول عرض المزارع */}
      <h2 className="mb-3">قائمة المزارع</h2>
      {loading ? (
        <p>جاري تحميل البيانات...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>اسم المزرعة</th>
              <th>عدد الدجاج الابتدائي</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {farms.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">لا توجد مزارع مسجلة</td>
              </tr>
            ) : (
              farms.map((farm, index) => (
                <tr key={farm.$id}>
                  <td>{index + 1}</td>
                  <td>{farm.name}</td>
                  <td>{farm.initialChecken}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => loadFarmForEdit(farm)}
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setFarmToDelete(farm);
                        setShowDeleteModal(true);
                      }}
                    >
                      حذف
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* مودال تأكيد الحذف */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          هل أنت متأكد من حذف المزرعة "{farmToDelete?.name}"؟
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            تأكيد الحذف
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
