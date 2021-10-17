import React from 'react'
import {ScreenProps} from 'system/types'
import {
  Box,
  StoredFilesList,
  Typography
} from 'system/components'
import {runtime} from 'system/runtime'


type StoredFilesState = {
  loading: boolean
}


export default class StoredFilesScreen extends React.Component<ScreenProps, StoredFilesState> {
  state: StoredFilesState = {
    loading: true
  }

  render() {
    const screenCaption: string = runtime.screens[this.props.name].caption
    return (
      <React.Fragment>
        <Box mt={2} mb={2}>
          <Typography variant={'h4'}>{screenCaption || 'Files'}</Typography>
        </Box>
        <Box>
          <StoredFilesList
            apiEntity={this.props.params['apiEntity']}
            storageEntity={this.props.params['storageEntity']}
          />
        </Box>
      </React.Fragment>
    )
  }
}