interface BaseModal {
  isOpened: boolean;
  onClose: (...args: any) => any;
}

export {type BaseModal};
