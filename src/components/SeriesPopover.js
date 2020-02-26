import React from 'react';
import { Button, Popover, Grid, Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';

const SeriesPopover = ({ seriesTitle, conferences }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  let open = Boolean(anchorEl);
  const id = open ? 'series-popover' : undefined;

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-describedby={id} variant="outlined" color="primary" onClick={handleClick}>
        {seriesTitle}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Grid style={{margin: 20}}>
          <Typography variant="body1" color="textSecondary">Other Iterations</Typography>
          {conferences.map(conf => (
            <div style={{margin: 5}} key={conf.id}>
              <Link to={'/conf/' + conf.id} onClick={handleClose}>
                {conf.text}
              </Link>
            </div>
          ))
          }
        </Grid>

      </Popover>
    </div>
  );
};

export default withRouter(SeriesPopover);