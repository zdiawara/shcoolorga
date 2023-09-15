import { HookModalForm, TextInput } from "components";
import { WrapperV2Props, withMutationForm } from "hoc";
import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { typeOrganisationApi } from "api";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "utils/constants";
import { classeConverter, classeSchema } from "./classeUtils";
import { ClasseResource } from "types/academie.type";

/**
 * Formulaire d'ajout et de modification d'une matière
 * @param props
 * @returns
 */
const Form: FC<WrapperV2Props> = (props) => {
  return (
    <HookModalForm
      {...props}
      modalBodyClassName="bg-light p-3"
      onClose={props.onExit}
    >
      <Row className="g-2">
        <Col sm={6}>
          <TextInput label="Nom" name="nom" isRequired />
        </Col>
        <Col sm={6}>
          <TextInput label="Abrévition" name="abreviation" isRequired />
        </Col>
      </Row>
    </HookModalForm>
  );
};

const MatiereForm = withMutationForm(Form, classeSchema);

type MatiereModalProps = {
  closeModal: () => void;
  selected?: ClasseResource;
};

/**
 * Creer ou modifier une matière
 * @param param0
 * @returns
 */
export const ClasseModal: FC<MatiereModalProps> = ({
  closeModal,
  selected,
}) => {
  const query = useQueryClient();

  const save = (data: Record<string, any>) => {
    const body = classeConverter.toBody(data);
    if (selected?.id) {
      return typeOrganisationApi.update(selected.id, body);
    }
    return typeOrganisationApi.create(body);
  };

  const onSuccess = () => {
    query.invalidateQueries([QUERY_KEY.classes]);
    closeModal();
  };

  return (
    <MatiereForm
      onSave={save}
      title={`${selected?.id ? "Modifier" : "Ajouter"} une matière`}
      defaultValues={selected?.id ? classeConverter.toInput(selected) : {}}
      onSuccess={onSuccess}
      onExit={closeModal}
      modalProps={{
        animation: false,
        size: "lg",
      }}
    />
  );
};
