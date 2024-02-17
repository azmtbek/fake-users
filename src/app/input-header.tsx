'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ShuffleIcon } from '@radix-ui/react-icons';
import React, { ChangeEvent, Dispatch, useState, } from 'react';
import { Action, FormState } from './page';
import { SLIDER_MAX_VALUE, INPUT_MAX_VALUE } from './consts';
import { debounce } from 'lodash';
import { generatePureRandRandomizer } from './data-maker';

interface InputProps {
  dispatch: Dispatch<Action>;
  state: FormState;
}

const randomizer = generatePureRandRandomizer();

export default function InputHeader({ dispatch, state }: InputProps) {
  const [inputError, setInputError] = useState('');
  const handleErrorInput = (event: ChangeEvent<HTMLInputElement>) => {
    let val = event.target.value;
    console.log(val);
    const num = +val;
    if (!isNaN(num)) {
      val = '' + Math.min(INPUT_MAX_VALUE, num);
      dispatch({ type: 'SET_ERROR', payload: val });
    } else {
      setInputError(val.slice(0, val.length - 1));
    }
  };


  const [seed, setSeed] = useState('');
  const handleSeed = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    console.log(val);
    const num = +val;
    if (!isNaN(num)) {
      setSeed(val);
      dispatch({ type: 'SET_SEED', payload: num });
    } else {
      setSeed(val.slice(0, val.length - 1));
    }
  };

  const shuffleSeedRandomizer = () => {
    const rand = Math.floor(randomizer.next() * 10_000_000);
    setSeed('' + rand);
    dispatch({ type: 'SET_SEED', payload: rand });
  };


  return (
    <div className='flex w-full justify-between items-center pb-5'>
      <div className='flex items-center gap-3'>
        <Label>Region:</Label>
        <Select
          onValueChange={(value) => dispatch({ type: 'SET_REGION', payload: value })}
          value={state.region}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="us" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">USA</SelectItem>
            <SelectItem value="pl">Poland</SelectItem>
            <SelectItem value="es">Spain</SelectItem>
            <SelectItem value="ja">Japan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center gap-3 w-200'>
        <Label>Errors:</Label>
        <Slider
          className="w-32"
          value={[state.errorSlider]}
          max={SLIDER_MAX_VALUE} step={1}
          defaultValue={[0]}
          onValueChange={(value) => dispatch({ type: 'SET_ERROR', payload: value[0] })} />
        <Input className='w-20' type='text' max={'1000'}
          value={state.errorInput}
          // defaultValue={''}
          onChange={handleErrorInput}
        />
      </div>
      <div className='flex items-center gap-3'>
        <Label>Seed:</Label>
        <Input className='w-24'
          type='text'
          value={seed}
          onChange={handleSeed}
        />
        <Button variant={'ghost'} onClick={shuffleSeedRandomizer}><ShuffleIcon /></Button>
      </div>
      <div className='flex items-center gap-3'>
        <Button> Export</Button>
      </div>
    </div>
  );
}
