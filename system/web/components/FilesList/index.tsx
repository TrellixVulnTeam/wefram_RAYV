import React from 'react'
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  LoadingCircular,
  Tooltip,
  Typography
} from 'system/components'
import FileIcon from '@material-ui/icons/AttachFile'
import RemoveIcon from '@material-ui/icons/DeleteOutline'
import UploadIcon from '@material-ui/icons/Publish'
import OpenIcon from '@material-ui/icons/OpenInNew'
import EditIcon from '@material-ui/icons/Edit'
import {StoredFiles, StoredFile} from 'system/types'
import {RequestApiPath} from 'system/routing'
import {api} from 'system/api'
import {gettext} from 'system/l10n'
import {notifications} from 'system/notification'
import {runtime} from 'system/runtime'
import {storage} from 'system/storage'
import {dialog} from 'system/dialog'


export type FilesListProps = {
  apiEntity: string
  storageEntity: string
  permitDelete?: boolean
  permitEdit?: boolean
  permitUpload?: boolean
}

type FilesListState = {
  loading: boolean,
  items: StoredFiles,
  selected: number[]
}


export class FilesList extends React.Component<FilesListProps, FilesListState> {
  state: FilesListState = {
    loading: true,
    items: [],
    selected: []
  }

  replacingId: number | null

  constructor(props: FilesListProps, state: FilesListState) {
    super(props, state);
    this.replacingId = null
  }

  private fileinput: React.RefObject<HTMLInputElement> = React.createRef()

  componentDidMount() {
    this.load()
  }
  
  public load = (): void => {
    const path: RequestApiPath = this.requestPath()
    api.get(path).then(res => {
      const items: StoredFiles = res.data
      const ids: number[] = items.map((el: StoredFile) => el.id)
      const selected: number[] = this.state.selected.filter((el: number) => ids.includes(el))
      this.setState({
        items,
        selected,
        loading: false
      })
    }).catch(err => {
      notifications.showRequestError(err)
      this.setState({loading: false})
    })
  }

  private requestPath = (id?: number | null): RequestApiPath => {
    let app: string
    let path: string
    [app, path] = this.props.apiEntity.split('.', 2)
    return {
      app,
      path: (id ? `${path}/${id}` : path)
    }
  }

  public removeFile = (id: number): void => {
    dialog.showConfirm({
      okCallback: () => {
        dialog.hide()
        runtime.busy = true
        api.delete(this.requestPath(id)).then(() => {
          runtime.busy = false
          notifications.showSuccess()
          this.load()
        }).catch(err => {
          runtime.busy = false
          notifications.showRequestError(err)
        })
      }
    })
  }

  public removeFiles = (): void => {
    if (!this.state.selected.length)
      return
    const keys: number[] = this.state.selected
    dialog.showConfirm({
      okCallback: () => {
        dialog.hide()
        runtime.busy = true
        api.delete(this.requestPath(), {params: {keys}}).then(() => {
          runtime.busy = false
          notifications.showSuccess()
          this.load()
        }).catch(err => {
          runtime.busy = false
          notifications.showRequestError(err)
        })
      }
    })
  }

  private upload = (data: any): void => {
    const form: FormData = new FormData()
    if (data.target.files.length > 1) {
      data.target.files.forEach((file: any, index: number) => {
        form.append(`file${index}`, file)
      })
    } else {
      form.append('file', data.target.files[0])
    }
    runtime.busy = true

    const requestPath: RequestApiPath = this.requestPath(this.replacingId)
    if (this.replacingId !== null) {
      api.put(requestPath, form).then(() => {
        runtime.busy = false
        notifications.showSuccess()
        this.load()
      }).catch(err => {
        runtime.busy = false
        notifications.showRequestError(err)
      })
    } else {
      api.post(requestPath, form).then(() => {
        runtime.busy = false
        notifications.showSuccess()
        this.load()
      }).catch(err => {
        runtime.busy = false
        notifications.showRequestError(err)
      })
    }
  }

  public renameFile = (id: number, caption: string): void => {
    runtime.busy = true
    api.put(this.requestPath(id), {caption}).then(() => {
      runtime.busy = false
      notifications.showSuccess()
      this.load()
    }).catch(err => {
      runtime.busy = false
      notifications.showRequestError(err)
    })
  }

  private selectFileForUpload = (id?: number): void => {
    this.replacingId = id || null
    this.fileinput.current?.click()
  }

  render() {
    if (this.state.loading)
      return (
        <Box display={'flex'} justifyContent={'center'}>
          <LoadingCircular />
        </Box>
      )

    if (!this.state.items.length)
      return (
        <Box pt={3} pb={3} borderTop={'1px solid #aaa'} borderBottom={'1px solid #aaa'}>
          <Typography>{gettext("There are no files uploaded yet.", 'system.ui')}</Typography>
        </Box>
      )

    return (
      <Box>
        {((this.props.permitUpload ?? true) || (this.props.permitEdit ?? true)) && (
          <input
            type={'file'}
            ref={this.fileinput}
            style={{display: 'none'}}
            onChange={this.upload}
          />
        )}

        {((this.props.permitUpload ?? true) || (this.props.permitDelete ?? true)) && (
          <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
            {(this.props.permitDelete ?? true) && (
              <Tooltip title={gettext("Delete selected files")}>
                <IconButton
                  color={'secondary'}
                  disabled={!this.state.selected.length}
                  onClick={() => {
                    this.removeFiles()
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            )}
            {(this.props.permitUpload ?? true) && (
              <Tooltip title={gettext("Delete selected files")}>
                <Button
                  color={'primary'}
                  variant={'outlined'}
                  startIcon={<UploadIcon />}
                  style={{
                    marginLeft: '8px'
                  }}
                  onClick={() => this.selectFileForUpload()}
                >
                  {gettext("Upload", 'system.ui')}
                </Button>
              </Tooltip>
            )}
          </Box>
        )}
        {this.state.items.map((item: StoredFile) => (
          <Box pt={1} pb={1} borderTop={'1px solid #bbb'}>
            <Grid container alignItems={'center'}>
              {(this.props.permitDelete ?? true) && (
                <Grid item xs={1}>
                  <Checkbox
                    checked={this.state.selected.includes(item.id)}
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                      let selected: number[] = this.state.selected
                      if (ev.target.checked) {
                        selected.push(item.id)
                      } else {
                        selected = selected.filter((el: number) => el != item.id)
                      }
                      this.setState({selected})
                    }}
                  />
                </Grid>
              )}
              {!(this.props.permitDelete ?? true) && (
                <Grid item xs={1}><FileIcon /></Grid>
              )}
              <Grid item xs={9}>
                <Typography>{item.caption || item.file}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                  <Tooltip title={gettext("Open file", 'system.ui')}>
                    <IconButton
                      onClick={() => {
                        window.open(storage.urlFor(this.props.storageEntity, item.file), '_blank')
                      }}
                    ><OpenIcon /></IconButton>
                  </Tooltip>
                  {(this.props.permitEdit ?? true) && (
                    <React.Fragment>
                    <Tooltip title={gettext("Rename file", 'system.ui')}>
                      <IconButton
                        onClick={() => {
                          dialog.prompt({
                            defaultValue: item.caption,
                            okCallback: (value: string) => {
                              dialog.hide()
                              if (!value)
                                return
                              this.renameFile(item.id, value)
                            }
                          })
                        }}
                      ><EditIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title={gettext("Replace file", 'system.ui')}>
                      <IconButton
                        onClick={() => {
                          this.selectFileForUpload(item.id)
                        }}
                      ><UploadIcon /></IconButton>
                    </Tooltip>
                    </React.Fragment>
                  )}
                  {(this.props.permitDelete ?? true) && (
                    <Tooltip title={gettext("Delete file", 'system.ui')}>
                      <IconButton
                        onClick={() => {
                          this.removeFile(item.id)
                        }}
                      ><RemoveIcon /></IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    )
  }
}

