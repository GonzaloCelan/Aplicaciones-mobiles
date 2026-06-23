import { fireEvent, render } from "@testing-library/react-native";

import CustomButton from "../Button";

describe("CustomButton", () => {
  it("renderiza el texto y ejecuta onPress al tocarlo", async () => {
    const onPressMock = jest.fn();

    const { getByText } = await render(
      <CustomButton
        title="Agregar Medicación"
        onPress={onPressMock}
      />
    );

    const buttonText = getByText("Agregar Medicación");

    fireEvent.press(buttonText);

    expect(onPressMock).toHaveBeenCalled();
  });
});