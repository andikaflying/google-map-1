import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import * as actionType from "../../Redux/actions";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@mui/material";
import MapBox from "../../Components/Map/MapBox";
import MarkInfo from "../../Components/Map/MarkInfo";

const options = {
  fields: ["formatted_address", "geometry", "name"],
  strictBounds: false,
  types: ["establishment"],
};
let marker = null;
let infowindow = null;

function MapView(props) {
  const { placeInformation, actions } = props;
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  /* REF */
  const autoCompleteRef = useRef();
  const autoCompleteInputRef = useRef();
  const mapRef = useRef();
  const mapInputRef = useRef();
  const infowindowRef = useRef();
  const biasInputRef = useRef();
  const strictBoundsInputRef = useRef();

  const initGoogleMap = () => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      autoCompleteInputRef.current,
      options
    );

    mapRef.current = new window.google.maps.Map(mapInputRef.current, {
      center: { lat: 40.749933, lng: -73.98633 },
      zoom: 13,
      mapTypeControl: false,
    });

    autoCompleteRef.current.bindTo("bounds", mapRef.current);

    marker = new window.google.maps.Marker({
      map: mapRef.current,
      anchorPoint: new window.google.maps.Point(0, -29),
    });

    infowindow = new window.google.maps.InfoWindow();
    infowindow.setContent(infowindowRef.current);

    autoCompleteRef.current.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);

      //untuk mendapatkan place nya...
      const place = autoCompleteRef.current.getPlace();
      actions.addPlace({ place: place });
    });
  };

  useEffect(() => {
    initGoogleMap();
  }, []);

  useEffect(() => {
    if (placeInformation) {
      if (placeInformation?.viewport) {
        mapRef.current.fitBounds(placeInformation.viewport);
      } else {
        mapRef.current.setCenter(placeInformation.location);
        mapRef.current.setZoom(17);
      }
      marker.setPosition(placeInformation.location);
      marker.setVisible(true);
      setTitle(placeInformation.name);
      setAddress(placeInformation.address);
      infowindow.open(mapRef.current, marker);
    }
  }, [placeInformation]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;

    let array = [];
    if (value !== "all") {
      array.push(event.target.value);
    }

    autoCompleteRef.current.setTypes(array);
    autoCompleteInputRef.current.value = "";
  };

  const onBiasChecked = (checked) => {
    if (checked) {
      autoCompleteRef.current.bindTo("bounds", mapRef.current);
    } else {
      autoCompleteRef.current.unbind("bounds");
      autoCompleteRef.current.setBounds({
        east: 180,
        west: -180,
        north: 90,
        south: -90,
      });
      strictBoundsInputRef.current.value = checked;
    }

    autoCompleteInputRef.current.value = "";
  };

  const onStrictBoundsChecked = (checked) => {
    autoCompleteRef.current.setOptions({
      strictBounds: checked,
    });

    if (checked) {
      biasInputRef.current.value = checked;
      autoCompleteRef.current.bindTo("bounds", mapRef.current);
    }

    autoCompleteInputRef.current.value = "";
  };

  return (
    <div id="main-layout">
      <MapBox ref={mapInputRef} />
      <Card>
        <CardHeader title="Find A Place" />
        <Divider />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item md={12} xs={12}>
              <RadioGroup
                aria-labelledby="category"
                defaultValue="all"
                name="category"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
                onChange={handleCategoryChange}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel
                  value="estabilishment"
                  control={<Radio />}
                  label="Estabilishment"
                />
                <FormControlLabel
                  value="address"
                  control={<Radio />}
                  label="Address"
                />
                <FormControlLabel
                  value="geocode"
                  control={<Radio />}
                  label="Geocode"
                />
                <FormControlLabel
                  value="(cities)"
                  control={<Radio />}
                  label="(Cities)"
                />
                <FormControlLabel
                  value="(regions)"
                  control={<Radio />}
                  label="(Regions)"
                />
              </RadioGroup>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    defaultChecked
                    onChange={(e) => {
                      onBiasChecked(e.target.checked);
                    }}
                    inputRef={biasInputRef}
                  />
                }
                label="Bias to map viewport"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    onChange={(e) => {
                      onStrictBoundsChecked(e.target.checked);
                    }}
                    inputRef={strictBoundsInputRef}
                  />
                }
                label="Push Notifications"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                name="address"
                type="text"
                variant="outlined"
                inputRef={autoCompleteInputRef}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <MarkInfo title={title} address={address} ref={infowindowRef} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    placeInformation: state.addPlace.placeInformation,
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    addPlace: (payload) => {
      dispatch(actionType.addPlace(payload));
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
