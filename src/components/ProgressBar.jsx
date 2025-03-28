import React from "react";

const ProgressBar = ({ step }) => {
  const totalSteps = 10; // Ajusta esto según el número total de pasos de la encuesta
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="progress mb-4">
      <div
        className="progress-bar"
        role="progressbar"
        style={{ width: `${progressPercentage}%` }}
        aria-valuenow={progressPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {Math.round(progressPercentage)}%
      </div>
    </div>
  );
};

export default ProgressBar; // ✅ Exportación por defecto
