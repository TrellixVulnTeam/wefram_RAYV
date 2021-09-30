import React from 'react'
import {FormItem, FormItemProps, MaskedTextField, MaskedTextFieldProps} from 'system/components'
import {FormFieldCommon} from './types'


export type FormMaskedInputProps = FormFieldCommon & MaskedTextFieldProps & {
  ref?: React.LegacyRef<FormMaskedInput>
  dense?: boolean
  small?: boolean
}

export type FormMaskedInputFieldProps = FormMaskedInputProps & FormItemProps & {
  ref?: React.LegacyRef<FormMaskedInput>
  fieldStyle?: React.CSSProperties
}


export class FormMaskedInput extends React.Component<FormMaskedInputProps> {

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!this.props._formOnChange || !this.props.formName)
      return
    this.props._formOnChange(this.props.formName, e.target.value)
  }

  render() {
    let {
      _formData,
      _formOnChange,
      formName,
      defaultValue,   // we defaults the defaultValue to the corresponding _formData
      dense,          // simplificates dense from 'margin=dense' to boolean 'dense'
      fullWidth,      // we overrides fullWidth defaults in forms from 'false' to 'true'
      small,
      ...elementProps
    } = this.props

    elementProps.onChange = elementProps.onChange ?? this.handleOnChange
    elementProps.margin = elementProps.margin ?? ((dense ?? true) ? 'dense' : 'normal')

    return (
      <MaskedTextField
        defaultValue={
          defaultValue ?? (
            (this.props._formData !== undefined && this.props.formName !== undefined)
              ? this.props._formData[this.props.formName]
              : ''
          )
        }
        size={small ? 'small' : 'medium'}
        fullWidth={fullWidth ?? true}
        {...elementProps}
      />
    )
  }
}


export class FormMaskedInputField extends React.Component<FormMaskedInputFieldProps> {
  render() {
    const {
      width,
      pt,
      pb,
      pl,
      pr,
      p,
      align,
      justify,
      fieldStyle,
      ...elementProps
    } = this.props
    const formItemProps = {
      width,
      pt,
      pb,
      pl,
      pr,
      p,
      align,
      justify,
      style: fieldStyle
    }
    return (
      <FormItem {...formItemProps}>
        <FormMaskedInput {...elementProps} />
      </FormItem>
    )
  }
}
