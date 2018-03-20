import * as React from 'react';

export const TitleBar: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45px',
    borderBottom: '1px solid #cbcbcb',
    backgroundColor: '#fff'
};

export const CommandBar: React.CSSProperties = {
    position: 'absolute',
    top: '45px',
    left: 0,
    right: 0,
    height: '35px',
    borderTop: '1px solid #fafafa',
    borderBottom: '1px solid #cbcbcb',
    backgroundColor: '#fff',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    transitionProperty: 'top',
    transitionDuration: '.3s',
    transitionTimingFunction: 'cubic-bezier(.65,.05,.36,1)'
};

export const ResourceBar: React.CSSProperties = {
    position: 'absolute',
    top: '80px',
    left: 0,
    width: '184px',
    bottom: '35px',
    borderRight: '1px solid #cbcbcb',
    backgroundColor: '#fff'
};

export const PropsBar: React.CSSProperties = {
    position: 'absolute',
    top: '80px',
    right: 0,
    width: '250px',
    bottom: '35px',
    borderLeft: '1px solid #cbcbcb',
    backgroundColor: '#fff'
};

export const ContributorBar: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '35px',
    borderTop: '1px solid #cbcbcb',
    backgroundColor: '#fff',
    paddingLeft: '24px',
    paddingRight: '24px',
    flex: '1 1',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center'
};
