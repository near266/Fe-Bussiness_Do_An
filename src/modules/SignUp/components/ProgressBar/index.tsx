import Icon from '@ant-design/icons';
import { Steps } from 'antd';
import clsx from 'clsx';
import { HTMLAttributes } from 'react';
interface IProps {
  currentStep: number;
  steps: { id: number; label: string }[];
  containerClassName?: string;
  textClassName?: string;
}
const tickedIcon = () => (
  <svg
    width="29"
    height="29"
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="14.236" cy="14.6797" r="14" fill="#403ECC" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.72663 12.9052C8.38322 12.5652 7.8292 12.568 7.48921 12.9114C7.14922 13.2548 7.152 13.8088 7.49541 14.1488L12.5926 19.1952C12.9524 19.5515 13.5387 19.5288 13.87 19.1458L21.0228 10.8772C21.3389 10.5117 21.299 9.9591 20.9335 9.64294C20.568 9.32679 20.0154 9.36677 19.6993 9.73225L13.1587 17.2931L8.72663 12.9052Z"
      fill="white"
    />
  </svg>
);
const untickedIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="14" cy="14" r="13.5" fill="white" stroke="#B5B5BE" />
  </svg>
);

const { Step } = Steps;
export const ProgressBar = (props: IProps) => {
  const { currentStep, steps, containerClassName, textClassName } = props;
  return (
    <div
      className={clsx(
        'flex w-full mx-auto px-0 justify-center bg-white shadow-[inset_0_-1px_0_#e2e2ea] pb-4',
        containerClassName
      )}
    >
      <Steps
        current={currentStep}
        labelPlacement="vertical"
        responsive={false}
        className="tw-flex tw-justify-center tw-items-center"
      >
        {steps.map((item, index) => (
          <Step
            key={item.id} // not recommand using key as index
            title={
              <p
                className={clsx(
                  'font-400 text-[14px] leading-[18px] text-center text-[#696974] ',
                  textClassName
                )}
              >
                {item.label}
              </p>
            }
            className=""
            icon={<Icon component={currentStep >= index ? tickedIcon : untickedIcon} />}
          />
        ))}
      </Steps>
    </div>
  );
};
