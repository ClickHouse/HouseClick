import * as Slider from '@radix-ui/react-slider'

interface RangeSliderProps {
  id: string,
  minPrice: number,
  maxPrice: number,
  onChange: (id: string, values: number[]) => void
  onCommit: (id: string, values: number[]) => void
}

const MAX_PRICE = 800000
const MIN_PRICE = 50000

export const RangeSlider: React.FC<RangeSliderProps> = ({ id, minPrice, maxPrice, onChange, onCommit}) => {

  return (
    <div className='pr-4'>
      <Slider.Root
        className='relative flex h-5 touch-none select-none items-center hover:cursor-pointer'
        max={MAX_PRICE}
        min={MIN_PRICE}
        step={1}
        defaultValue={[minPrice, maxPrice]}
        onValueChange={(values) => {onChange(id, values)}}
        onValueCommit={(values) => {onCommit(id, values)}}
        >
        <Slider.Track className='relative h-[3px] grow rounded-full bg-[#414141] hover:cursor-pointer'>
          <Slider.Range className='absolute h-full rounded-full bg-primary-300 ' />
        </Slider.Track>
        <Slider.Thumb
          className='block h-5 w-5 rounded-full border-4 border-neutral-800 bg-primary-300  focus:outline-none'
          aria-label='Min price'
          id='sliderThumb'>
        </Slider.Thumb>
        <Slider.Thumb
          className='block h-5 w-5 rounded-full border-4 border-neutral-800 bg-primary-300  focus:outline-none'
          aria-label='Max price'
          id='sliderThumb'>
        </Slider.Thumb>
      </Slider.Root>
    </div>
  )
}
