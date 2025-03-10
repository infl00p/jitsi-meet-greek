/* eslint-disable lines-around-comment */

import React from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { connect, useSelector } from 'react-redux';

import { IReduxState } from '../../../../app/types';
import { getConferenceName } from '../../../../base/conference/functions';
import { MEETING_NAME_ENABLED } from '../../../../base/flags/constants';
import { getFeatureFlag } from '../../../../base/flags/functions';
import { JitsiRecordingConstants } from '../../../../base/lib-jitsi-meet';
import { getLocalParticipant } from '../../../../base/participants/functions';
// @ts-ignore
import ConnectionIndicator from '../../../../connection-indicator/components/native/ConnectionIndicator';
// @ts-ignore
import RecordingLabel from '../../../../recording/components/native/RecordingLabel';
// @ts-ignore
import VideoQualityLabel from '../../../../video-quality/components/VideoQualityLabel.native';

// @ts-ignore
import styles from './styles';


interface IProps {

    /**
     * Name of the meeting we're currently in.
     */
    _meetingName: string;

    /**
     * Whether displaying the current meeting name is enabled or not.
     */
    _meetingNameEnabled: boolean;

}

/**
 * Implements a navigation bar component that is rendered on top of the
 * carmode screen.
 *
 * @param {IProps} props - The React props passed to this component.
 * @returns {JSX.Element}
 */
const TitleBar = (props: IProps): JSX.Element => {
    const localParticipant = useSelector(getLocalParticipant);
    const localParticipantId = localParticipant?.id;

    return (
        <TouchableOpacity
            activeOpacity = { 1 }
            style = { styles.titleBarWrapper as StyleProp<ViewStyle> }>
            <View
                pointerEvents = 'box-none'
                style = { styles.roomNameWrapper as StyleProp<ViewStyle> }>
                <View style = { styles.qualityLabelContainer as StyleProp<ViewStyle> }>
                    <VideoQualityLabel />
                </View>
                <ConnectionIndicator
                    // @ts-ignore
                    iconStyle = { styles.connectionIndicatorIcon }
                    // @ts-ignore
                    participantId = { localParticipantId } />
                <View style = { styles.headerLabels as StyleProp<ViewStyle> }>
                    <RecordingLabel mode = { JitsiRecordingConstants.mode.FILE } />
                    <RecordingLabel mode = { JitsiRecordingConstants.mode.STREAM } />
                </View>
                {
                    props._meetingNameEnabled
                    && <View style = { styles.roomNameView as StyleProp<ViewStyle> }>
                        <Text
                            numberOfLines = { 1 }
                            style = { styles.roomName }>
                            { props._meetingName }
                        </Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
    );
};

/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state: IReduxState) {
    const { hideConferenceSubject } = state['features/base/config'];

    return {
        _meetingName: getConferenceName(state),
        _meetingNameEnabled:
            getFeatureFlag(state, MEETING_NAME_ENABLED, true) && !hideConferenceSubject
    };
}

export default connect(_mapStateToProps)(TitleBar);
