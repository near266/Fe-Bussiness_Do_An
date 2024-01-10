import SrcIcons from '@/assets/icons';
import { Select } from 'antd';
import clsx from 'clsx';
import Image from 'next/legacy/image';
import { useCallback } from 'react';

export interface IProps {
  title?: string;
  required?: boolean;
  options?: any[];
  children?: React.ReactNode;
  initialValue?: any;
  suffixIcon?: React.ReactNode;
  disabled?: boolean;
  showSearch?: boolean;
  dropdownClassName?: string;
  selectClassName?: string;
  placeholder?: string;
  onChange?: (value: any) => void;
  dropdownRender?: (menu: React.ReactNode) => React.ReactNode;
  wrapperClassName?: string;
}
const { Option } = Select;
export function CustomSelector(props: IProps) {
  const {
    title,
    required,
    initialValue,
    showSearch,
    suffixIcon,
    options,
    placeholder,
    selectClassName,
    wrapperClassName,
    disabled,
    onChange,
    children,
  } = props;
  const handleSelect = useCallback((value: string) => {
    const data = {
      selectedId: value,
      selected: options.find((item) => item.value === value),
    };

    onChange && onChange(value);
  }, []);
  return (
    <>
      <div
        className={clsx(
          'flex w-full mb-[1rem] gap-3 flex-col flex-nowrap',
          wrapperClassName
        )}
      >
        {title && (
          <p className="block_title">
            {require && '*'}&nbsp;{title}
          </p>
        )}
        <Select
          defaultValue={initialValue ?? options[0]?.value}
          className={clsx(
            'rounded-[10px] bg-white w-full flex overflow-hidden z-[1] border border-solid border-[#d9d9d9]',
            selectClassName
          )}
          size="large"
          showSearch={showSearch}
          bordered={false}
          disabled={disabled}
          placement="bottomLeft"
          onChange={handleSelect}
          placeholder={placeholder || 'Chọn'}
          direction="rtl"
          // search by label
          // filterOption={}
          dropdownAlign={{ offset: [0, 0] }}
          // dropdownClassName="pt-[9px]"
          suffixIcon={
            suffixIcon ? (
              suffixIcon
            ) : (
              <div>
                <Image
                  width={20}
                  height={20}
                  src={SrcIcons.dropDown}
                  alt="Youth+ Doanh nghiệp"
                  objectFit="contain"
                />
              </div>
            )
          }
        >
          {children ?? (
            <>
              {options.length > 0 &&
                options.map((item) => (
                  <Option key={item.key} value={item.key}>
                    {/* <Tooltip placement="topLeft" title={item.label}> */}
                    <span className={clsx('font-[400] text-sm text-[#696974]')}>
                      {item.label}
                    </span>
                    {/* </Tooltip> */}
                  </Option>
                ))}
            </>
          )}
        </Select>
      </div>
    </>
  );
}
