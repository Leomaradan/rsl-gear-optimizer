import { FormInput, FormLabel, FormRow } from "./Layout";

import Modal from "../UI/Modal";
import Stack from "../UI/Stack";
import Wrapper from "../UI/Wrapper";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageAffinity } from "../../lang/language";
import type {
  IChampionAffinity,
  IGreatHallBonus,
  IGreatHallBonusAffinity,
} from "../../models";
import { setOption } from "../../redux/configurationSlice";
import type { IState } from "../../redux/reducers";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Dash, Plus } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

const GameProgression = (): JSX.Element => {
  const configuration = useSelector((state: IState) => state.configuration);

  const [showModal, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [hallBonus, setHallBonus] = useState(configuration.greatHallBonus);

  useEffect(() => {
    setHallBonus(configuration.greatHallBonus);
  }, [configuration.greatHallBonus]);

  const dispatch = useDispatch();
  const lang = useLanguage();

  const greatHallLevel = Object.keys(hallBonus).reduce((acc, affinityKey) => {
    const affinity = hallBonus[affinityKey as keyof IGreatHallBonus];
    const affinitySum = Object.keys(affinity).reduce(
      (accAffinity, stat) =>
        accAffinity + affinity[stat as keyof IGreatHallBonusAffinity],
      0
    );

    return acc + affinitySum;
  }, 0);

  const handleChangeArenaRank = (value: ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      setOption({
        option: "arenaRank",
        value: value?.target?.value ?? "Bronze1",
      })
    );
  };

  const handleChangeGreatHall = () => {
    dispatch(
      setOption({
        option: "greatHallBonus",
        value: hallBonus,
      })
    );
    handleClose();
  };

  const handleUpdateHallBonus = (
    affinity: keyof IGreatHallBonus,
    stat: keyof IGreatHallBonusAffinity,
    operation: number
  ) => {
    setHallBonus((current) => ({
      ...current,
      [affinity]: {
        ...current[affinity],
        [stat]: Math.max(0, Math.min(10, current[affinity][stat] + operation)),
      },
    }));
  };

  return (
    <>
      <h1>{lang.ui.title.gameProgression}</h1>
      <form>
        <FormRow>
          <FormLabel>{lang.ui.title.arenaRank}</FormLabel>
          <FormInput>
            <select
              className="custom-select"
              onChange={handleChangeArenaRank}
              value={configuration.arenaRank}
            >
              <option value="B1">{lang.arena.bronze1}</option>
              <option value="B2">{lang.arena.bronze2}</option>
              <option value="B3">{lang.arena.bronze3}</option>
              <option value="B4">{lang.arena.bronze4}</option>
              <option value="S1">{lang.arena.silver1}</option>
              <option value="S2">{lang.arena.silver2}</option>
              <option value="S3">{lang.arena.silver3}</option>
              <option value="S4">{lang.arena.silver4}</option>
              <option value="G1">{lang.arena.gold1}</option>
              <option value="G2">{lang.arena.gold2}</option>
              <option value="G3">{lang.arena.gold3}</option>
              <option value="G4">{lang.arena.gold4}</option>
              <option value="P">{lang.arena.platinium}</option>
            </select>
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>{lang.ui.title.greatHall}</FormLabel>
          <FormInput>
            <Button onClick={handleShow} variant="success">
              {lang.ui.message.greatHallBonus} {greatHallLevel}
            </Button>
            <Modal
              content={
                <Table variant="dark" striped bordered hover>
                  <thead>
                    <tr>
                      <td />
                      <th>{lang.stat.HP}</th>
                      <th>{lang.stat.ATK}</th>
                      <th>{lang.stat.DEF}</th>
                      <th>{lang.stat["C.RATE"]}</th>
                      <th>{lang.stat.RESI}</th>
                      <th>{lang.stat.ACC}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Magic", "Spirit", "Force", "Void"].map((affinityKey) => {
                      const affinity =
                        hallBonus[affinityKey as keyof IGreatHallBonus];
                      return (
                        <tr key={affinityKey}>
                          <td>
                            {
                              lang.affinity[
                                affinityKey as keyof ILanguageAffinity
                              ]
                            }
                          </td>
                          {Object.keys(affinity).map((statKey) => {
                            const stat =
                              affinity[
                                statKey as keyof IGreatHallBonusAffinity
                              ];

                            return (
                              <td key={`${affinityKey}-${statKey}`}>
                                <Stack>
                                  <strong>{stat}</strong>
                                  <Wrapper>
                                    <Button
                                      variant="secondary"
                                      onClick={() => {
                                        handleUpdateHallBonus(
                                          affinityKey as IChampionAffinity,
                                          statKey as keyof IGreatHallBonusAffinity,
                                          -1
                                        );
                                      }}
                                    >
                                      <Dash />
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      onClick={() => {
                                        handleUpdateHallBonus(
                                          affinityKey as IChampionAffinity,
                                          statKey as keyof IGreatHallBonusAffinity,
                                          1
                                        );
                                      }}
                                    >
                                      <Plus />
                                    </Button>
                                  </Wrapper>
                                </Stack>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              }
              onClose={handleClose}
              onSave={handleChangeGreatHall}
              show={showModal}
              title={`${lang.ui.message.greatHallBonus} ${greatHallLevel}`}
            />
          </FormInput>
        </FormRow>
      </form>
    </>
  );
};

export default GameProgression;
