import React from 'react';
import {
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react';

type LabeledSwitchProps = {
  id: string,
  label: string,
  isChecked?: boolean,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
};

function LabeledSwitch({
  id, label, isChecked, onChange,
}: LabeledSwitchProps) {
  return (
    <FormControl display="flex" alignItems="center" w="auto">
      <FormLabel htmlFor={id} mb={0}>{label}</FormLabel>
      <Switch
        id={id}
        isChecked={isChecked}
        onChange={onChange}
      />
    </FormControl>
  );
}

export default LabeledSwitch;
