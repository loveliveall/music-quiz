import React from 'react';
import {
  FormControl,
  FormLabel,
  Switch,
  Tooltip,
} from '@chakra-ui/react';

type LabeledSwitchProps = {
  id: string,
  label: string,
  tooltip?: string,
  isChecked?: boolean,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
};

function LabeledSwitch({
  id, label, tooltip, isChecked, onChange,
}: LabeledSwitchProps) {
  const Content = (
    <FormControl display="flex" alignItems="center" w="auto">
      <FormLabel htmlFor={id} mb={0}>{label}</FormLabel>
      <Switch
        id={id}
        colorScheme="green"
        isChecked={isChecked}
        onChange={onChange}
      />
    </FormControl>
  );
  if (tooltip === undefined) return Content;
  return (
    <Tooltip hasArrow label={tooltip}>
      {Content}
    </Tooltip>
  );
}

export default LabeledSwitch;
