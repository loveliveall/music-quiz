import React from 'react';
import {
  useColorModeValue,
  useDisclosure,
  Button,
  Input, InputProps,
  InputLeftElement,
  InputGroup,
  List,
  ListItem, ListItemProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import {
  BiChevronDown,
  BiChevronUp,
  BiSearch,
} from 'react-icons/bi';

import { mod } from '@/utils';

type Item = {
  key: string,
  label: string,
};

type SearchableSelectProps = {
  itemList: Item[],
  selectedItemKey: string,
  setSelectedItemKey: (newV: string) => void,
};

function SearchableSelect({
  itemList, selectedItemKey, setSelectedItemKey,
}: SearchableSelectProps) {
  const hoverItemColor = useColorModeValue('gray.200', 'gray.600');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [input, setInput] = React.useState('');
  const [highlightedIdx, setHighlightedIdx] = React.useState(0);

  const searchedItemList = itemList; // TODO: Add search logic
  const inputRef = React.useRef<HTMLInputElement>(null);
  const ulRef = React.useRef<HTMLUListElement>(null);
  const liRefs = itemList.reduce((acc, _, idx) => {
    acc[idx] = React.createRef<HTMLLIElement>();
    return acc;
  }, {} as { [key: number]: React.RefObject<HTMLLIElement> });

  const updateHighlightedIdx = (idx: number) => {
    setHighlightedIdx(idx);
    // Adjust scroll position if highlighted item is out of visible area
    const ulVisibleStart = ulRef.current?.scrollTop ?? 0;
    const ulVisibleHeight = ulRef.current?.clientHeight ?? 0;
    const ulVisibleEnd = ulVisibleStart + ulVisibleHeight;
    const itemYPos = new Array(idx).fill(null).reduce((acc: number, _, i) => {
      return acc + (liRefs[i]?.current?.scrollHeight ?? 0);
    }, 0);
    const itemHeight = liRefs[idx]?.current?.scrollHeight ?? 0;
    if (itemYPos < ulVisibleStart) {
      // Item is above the visible area
      ulRef.current?.scrollTo(0, itemYPos);
    } else if (ulVisibleEnd < (itemYPos + itemHeight)) {
      // Item is below the visible area
      ulRef.current?.scrollTo(0, itemYPos + itemHeight - ulVisibleHeight);
    }
  };
  const onItemSelect = (idx: number) => {
    const item = searchedItemList[idx];
    if (item === undefined) return;
    setInput(''); // Empty input on select
    setSelectedItemKey(item.key);
    onClose();
  };

  React.useEffect(() => {
    setInput('');
    const selectedIdx = searchedItemList.findIndex((e) => e.key === selectedItemKey);
    updateHighlightedIdx(Math.max(selectedIdx, 0));
  }, [isOpen]);
  React.useEffect(() => {
    updateHighlightedIdx(0);
  }, [input]);

  const onInputKeyDown: InputProps['onKeyDown'] = (ev) => {
    if (ev.code === 'ArrowUp' || ev.code === 'ArrowDown') {
      ev.preventDefault(); // Do not move cursor on arrow up/down
      const newHighlight = mod(ev.code === 'ArrowUp' ? highlightedIdx - 1 : highlightedIdx + 1, searchedItemList.length);
      updateHighlightedIdx(newHighlight);
    }
    if (ev.code === 'Enter') {
      onItemSelect(highlightedIdx);
    }
  };
  const onItemHover = (idx: number): ListItemProps['onMouseMove'] => () => {
    if (idx !== highlightedIdx) {
      updateHighlightedIdx(idx);
    }
  };

  const buttonLabel = itemList.find((e) => e.key === selectedItemKey)?.label ?? 'N/A';
  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={inputRef}
    >
      <PopoverTrigger>
        <Button
          variant="outline"
          onClick={onOpen}
          rightIcon={isOpen ? <BiChevronUp /> : <BiChevronDown />}
        >
          {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent _focus={{ outline: 'none' }}>
        <PopoverBody p={2}>
          <InputGroup>
            <InputLeftElement>
              <BiSearch />
            </InputLeftElement>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="곡명 혹은 약칭 검색"
              onKeyDown={onInputKeyDown}
            />
          </InputGroup>
          <List
            ref={ulRef}
            maxH="40vh"
            mt={2}
            // overflowY="auto"
          >
            {searchedItemList.map((item, idx) => {
              return (
                <ListItem
                  key={item.key}
                  ref={liRefs[idx]}
                  cursor="pointer"
                  py={1}
                  px={2}
                  bgColor={idx === highlightedIdx ? hoverItemColor : undefined}
                  onMouseMove={onItemHover(idx)}
                  onClick={() => onItemSelect(idx)}
                >
                  <Text>{item.label}</Text>
                </ListItem>
              );
            })}
            {searchedItemList.length === 0 && (
              <Text>검색 결과가 없습니다.</Text>
            )}
          </List>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default SearchableSelect;
