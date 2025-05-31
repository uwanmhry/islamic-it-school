 tailwind.config = {
        theme: {
          extend: {
            animation: {
              float: "float 6s ease-in-out infinite",
              "pulse-slow": "pulse-slow 4s ease-in-out infinite",
              slideDown: "slideDown 0.3s ease-out",
              slideUp: "slideUp 0.3s ease-out",
            },
            keyframes: {
              float: {
                "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                "33%": { transform: "translateY(-20px) rotate(1deg)" },
                "66%": { transform: "translateY(-10px) rotate(-1deg)" },
              },
              "pulse-slow": {
                "0%, 100%": {
                  transform: "scale(1) rotate(0deg)",
                  opacity: "0.1",
                },
                "50%": {
                  transform: "scale(1.1) rotate(180deg)",
                  opacity: "0.2",
                },
              },
              slideDown: {
                "0%": { transform: "translateY(-100%)", opacity: "0" },
                "100%": { transform: "translateY(0)", opacity: "1" },
              },
              slideUp: {
                "0%": { transform: "translateY(0)", opacity: "1" },
                "100%": { transform: "translateY(-100%)", opacity: "0" },
              },
              animation: {
                float: "float 3s ease-in-out infinite",
              },
            },
          },
        },
      };