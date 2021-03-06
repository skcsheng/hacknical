import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'light-ui';
import styles from './date_slider.css';
import dateHelper from 'UTILS/date';

const getDateBySeconds = dateHelper.date.bySeconds;
const getDateBeforeYears = dateHelper.date.beforeYears;
const getValidatorDate = dateHelper.validator.date;
const getValidatorFullDate = dateHelper.validator.fullDate;
const getSecondsByDate = dateHelper.seconds.getByDate;
const afterDays = dateHelper.date.afterDays;

const SECONDS_PER_DAY = 24 * 60 * 60 * 30;
const MAX_DATE = afterDays(1);

class DateSlider extends React.Component {
  constructor(props) {
    super(props);
    const { initialStart, initialEnd, maxDate } = this.props;
    this.state = {
      startDate: initialStart,
      endDate: initialEnd || maxDate
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(seconds) {
    const { onStartChange, onEndChange } = this.props;
    const [startSeconds, endSeconds] = seconds;
    const startDate = getDateBySeconds(startSeconds);
    const endDate = getDateBySeconds(endSeconds);

    onStartChange && onStartChange(startDate);
    onEndChange && onEndChange(endDate, endDate === MAX_DATE);
    this.setState({
      startDate,
      endDate
    });
  }

  componentWillReceiveProps(nextProps) {
    const { initialStart, initialEnd, maxDate } = nextProps;
    this.setState({
      startDate: initialStart,
      endDate: initialEnd || maxDate
    });
  }

  get pushInterval() {
    const { pushInterval } = this.props;
    switch (pushInterval) {
      case 'day':
        return SECONDS_PER_DAY;
      case 'month':
        return SECONDS_PER_DAY * 30;
      case 'halfYear':
        return SECONDS_PER_DAY * 30 * 6;
      case 'year':
        return SECONDS_PER_DAY * 30 * 12;
      case '2year':
        return SECONDS_PER_DAY * 30 * 24;
      default:
        return SECONDS_PER_DAY * 30;
    }
  }

  render() {
    const {
      minDate,
      maxDate,
      startText,
      endText
    } = this.props;

    const {
      startDate,
      endDate
    } = this.state;
    const validateEndDate = getValidatorFullDate(endDate);

    return (
      <div className={styles.slider_container}>
        <Slider
          min={getSecondsByDate(minDate)}
          max={getSecondsByDate(maxDate)}
          value={[
            getSecondsByDate(startDate),
            getSecondsByDate(endDate)
          ]}
          tipFormatter={(seconds) => {
            const date = getDateBySeconds(seconds);
            const fullDate = getValidatorFullDate(date);
            return (
              <div className={styles.slider_tipso}>
                {MAX_DATE === fullDate ? '至今' : getValidatorDate(date)}
              </div>
            );
          }}
          onChange={this.onChange}
          minRange={SECONDS_PER_DAY}
        />
        <div className={styles.slider_tips_container}>
          <div className={styles.slider_tips}>
            {startText}
            <span>
              {getValidatorDate(startDate)}
            </span>
          </div>
          <div className={styles.slider_tips}>
            <span>
              {
                MAX_DATE === validateEndDate
                  ? '至今'
                  : getValidatorDate(endDate)
              }
            </span>
            {endText}
          </div>
        </div>
      </div>
    )
  }
}

DateSlider.propTypes = {
  pushInterval: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  startText: PropTypes.string,
  endText: PropTypes.string,
  initialStart: PropTypes.string,
  initialEnd: PropTypes.string,
  onStartChange: PropTypes.func,
  onEndChange: PropTypes.func
};

DateSlider.defaultProps = {
  pushInterval: 'day',
  minDate: getDateBeforeYears(10),
  maxDate: MAX_DATE,
  initialStart: getDateBeforeYears(2),
  initialEnd: getDateBeforeYears(1),
  startText: '开始时间',
  endText: '结束时间',
  onStartChange: () => {},
  onEndChange: () => {}
};

export default DateSlider;
