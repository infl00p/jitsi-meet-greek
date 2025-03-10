// @flow

import React, { Component } from 'react';

import { getLocalizedDateFormatter, getLocalizedDurationFormatter } from '../../../i18n/dateUtil';
import { translate } from '../../../i18n/functions';
import Icon from '../../../icons/components/Icon';
import { IconTrash } from '../../../icons/svg';

import Container from './Container';
import Text from './Text';

type Props = {

    /**
     * Indicates if the list is disabled or not.
     */
    disabled: boolean,

    /**
     * Indicates if the URL should be hidden or not.
     */
    hideURL: boolean,

    /**
     * Function to be invoked when an item is pressed. The item's URL is passed.
     */
    onPress: Function,

    /**
     * Rendered when the list is empty. Should be a rendered element.
     */
    listEmptyComponent: Object,

    /**
     * An array of meetings.
     */
    meetings: Array<Object>,

    /**
     * Handler for deleting an item.
     */
    onItemDelete?: Function,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * Generates a date string for a given date.
 *
 * @param {Object} date - The date.
 * @private
 * @returns {string}
 */
function _toDateString(date) {
    return getLocalizedDateFormatter(date).format('ll');
}


/**
 * Generates a time (interval) string for a given times.
 *
 * @param {Array<Date>} times - Array of times.
 * @private
 * @returns {string}
 */
function _toTimeString(times) {
    if (times && times.length > 0) {
        return (
            times
                .map(time => getLocalizedDateFormatter(time).format('LT'))
                .join(' - '));
    }

    return undefined;
}

/**
 * Implements a React/Web {@link Component} for displaying a list with
 * meetings.
 *
 * @augments Component
 */
class MeetingsList extends Component<Props> {
    /**
     * Constructor of the MeetingsList component.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._onPress = this._onPress.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    /**
     * Renders the content of this component.
     *
     * @returns {React.ReactNode}
     */
    render() {
        const { listEmptyComponent, meetings } = this.props;

        /**
         * If there are no recent meetings we don't want to display anything.
         */
        if (meetings) {
            return (
                <Container className = 'meetings-list'>
                    {
                        meetings.length === 0
                            ? listEmptyComponent
                            : meetings.map(this._renderItem)
                    }
                </Container>
            );
        }

        return null;
    }

    _onPress: string => Function;

    /**
     * Returns a function that is used in the onPress callback of the items.
     *
     * @param {string} url - The URL of the item to navigate to.
     * @private
     * @returns {Function}
     */
    _onPress(url) {
        const { disabled, onPress } = this.props;

        if (!disabled && url && typeof onPress === 'function') {
            return () => onPress(url);
        }

        return null;
    }

    _onKeyPress: string => Function;

    /**
     * Returns a function that is used in the onPress callback of the items.
     *
     * @param {string} url - The URL of the item to navigate to.
     * @private
     * @returns {Function}
     */
    _onKeyPress(url) {
        const { disabled, onPress } = this.props;

        if (!disabled && url && typeof onPress === 'function') {
            return e => {
                if (e.key === ' ' || e.key === 'Enter') {
                    onPress(url);
                }
            };
        }

        return null;
    }

    _onDelete: Object => Function;

    /**
     * Returns a function that is used on the onDelete callback.
     *
     * @param {Object} item - The item to be deleted.
     * @private
     * @returns {Function}
     */
    _onDelete(item) {
        const { onItemDelete } = this.props;

        return evt => {
            evt.stopPropagation();

            onItemDelete && onItemDelete(item);
        };
    }

    _onDeleteKeyPress: Object => Function;

    /**
     * Returns a function that is used on the onDelete keypress callback.
     *
     * @param {Object} item - The item to be deleted.
     * @private
     * @returns {Function}
     */
    _onDeleteKeyPress(item) {
        const { onItemDelete } = this.props;

        return e => {
            if (onItemDelete && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                e.stopPropagation();
                onItemDelete(item);
            }
        };
    }

    _renderItem: (Object, number) => React$Node;

    /**
     * Renders an item for the list.
     *
     * @param {Object} meeting - Information about the meeting.
     * @param {number} index - The index of the item.
     * @returns {Node}
     */
    _renderItem(meeting, index) {
        const {
            date,
            duration,
            elementAfter,
            time,
            title,
            url
        } = meeting;
        const { hideURL = false, onItemDelete, t } = this.props;
        const onPress = this._onPress(url);
        const onKeyPress = this._onKeyPress(url);
        const rootClassName
            = `item ${
                onPress ? 'with-click-handler' : 'without-click-handler'}`;

        return (
            <Container
                className = { rootClassName }
                key = { index }
                onClick = { onPress }>
                <Container className = 'right-column'>
                    <Text
                        className = 'title'
                        onClick = { onPress }
                        onKeyPress = { onKeyPress }
                        role = 'button'
                        tabIndex = { 0 }>
                        { title }
                    </Text>
                    {
                        hideURL || !url ? null : (
                            <Text>
                                { url }
                            </Text>)
                    }
                    {
                        typeof duration === 'number' ? (
                            <Text className = 'subtitle'>
                                { getLocalizedDurationFormatter(duration) }
                            </Text>) : null
                    }
                </Container>
                <Container className = 'left-column'>
                    <Text className = 'title'>
                        { _toDateString(date) }
                    </Text>
                    <Text className = 'subtitle'>
                        { _toTimeString(time) }
                    </Text>
                </Container>
                <Container className = 'actions'>
                    { elementAfter || null }

                    { onItemDelete && <Icon
                        ariaLabel = { t('welcomepage.recentListDelete') }
                        className = 'delete-meeting'
                        onClick = { this._onDelete(meeting) }
                        onKeyPress = { this._onDeleteKeyPress(meeting) }
                        role = 'button'
                        src = { IconTrash }
                        tabIndex = { 0 } />}
                </Container>
            </Container>
        );
    }
}

export default translate(MeetingsList);
