import { TextInput, TextInputProps } from "react-native-paper";
import { theme } from "../../theme/theme";

const InputStyled = (props: TextInputProps) => {
    return (
        <TextInput
            {...props}
            theme={{ colors: { primary: theme.hoagieColors.text } }}
        />
    )
}

export default InputStyled;