'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ShuffleIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';

const SLIDER_MAX_VALUE = 10;
const INPUT_MAX_VALUE = 1000;

export default function InputHeader() {
  const [errors, setErrors] = useState(0);
  const [inputErrors, setInputErrors] = useState('0');
  const [region, setRegion] = useState('usa');

  const onSliderErrorsChange = (num: number) => {
    setInputErrors('' + num);
    setErrors(num);
  };
  const onInputErrorsChange = (e: string) => {
    const num = +e;
    if (!isNaN(num)) {
      if (num > INPUT_MAX_VALUE) setInputErrors("" + INPUT_MAX_VALUE);
      else setInputErrors("" + e);
      setErrors(Math.min(SLIDER_MAX_VALUE, num));
    } else {
      setInputErrors(e.slice(0, e.length - 1));
    }
  };
  return (
    <div className='flex w-full justify-between items-center pb-5'>
      <div className='flex items-center gap-3'>
        <Label>Region:</Label>
        <Select onValueChange={(value) => setRegion(value)} value={region}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="usa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usa">Us</SelectItem>
            <SelectItem value="pl">Pl</SelectItem>
            <SelectItem value="uk">Uk</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center gap-3 w-200'>
        <Label>Errors:</Label>
        <Slider
          className="w-32"
          value={[Math.min(errors, SLIDER_MAX_VALUE)]}
          defaultValue={[0]} max={SLIDER_MAX_VALUE} step={1}
          onValueChange={(value) => onSliderErrorsChange(value[0])} />
        <Input className='w-20' type='text' max={'1000'}
          defaultValue={0}
          value={inputErrors}
          onChange={(e) => { onInputErrorsChange(e.target.value); }}
        />
      </div>
      <div className='flex items-center gap-3'>
        <Label>Seed:</Label>
        <Input className='w-20' type='text' defaultValue={''} />
        <Button variant={'ghost'}><ShuffleIcon /></Button>
      </div>
      <div className='flex items-center gap-3'>
        <Button> Export</Button>
      </div>
    </div>
  );
}
